// Atualizar a função calculateMatch para corrigir a recomendação de cães pequenos/médios para guarda

export function calculateMatch(answers, dogBreeds) {
  // Primeiro, filtrar as raças pelo porte e objetivo selecionados
  let filteredBreeds = [...dogBreeds]

  // Aplicar filtro de porte
  if (answers.porte) {
    filteredBreeds = filteredBreeds.filter((breed) => {
      if (answers.porte === "pequeno" && breed.size.includes("Pequeno")) return true
      if (answers.porte === "medio" && breed.size.includes("Médio")) return true
      if (answers.porte === "grande" && breed.size.includes("Grande")) return true
      if (answers.porte === "gigante" && breed.size.includes("Gigante")) return true
      return false
    })
  }

  // Aplicar filtro de objetivo, com lógica especial para cães pequenos/médios para guarda
  if (answers.objetivo) {
    // Se o objetivo for guarda e o porte for pequeno ou médio, precisamos ser mais específicos
    if (answers.objetivo === "guarda" && (answers.porte === "pequeno" || answers.porte === "medio")) {
      // Filtrar apenas raças pequenas/médias que realmente são adequadas para guarda
      filteredBreeds = filteredBreeds.filter((breed) => {
        // Verificar se a raça tem "Guarda" como propósito principal
        const isGuardDog = breed.purpose.includes("Guarda")

        // Verificar se a raça tem características de cão de guarda
        // (alta vigilância, latido de alerta, territorialidade)
        const hasGuardTraits =
          // Raças pequenas/médias conhecidas por serem bons cães de guarda
          [
            "Schnauzer",
            "Bull Terrier",
            "Dachshund",
            "Jack Russell Terrier",
            "Basenji",
            "Fox Terrier",
            "Spitz Alemão",
            "Pinscher",
          ].some((guardBreed) => breed.name.includes(guardBreed))

        return isGuardDog || hasGuardTraits
      })

      // Se não encontrarmos raças adequadas, vamos incluir algumas raças maiores de guarda
      // mas com penalidade na pontuação
      if (filteredBreeds.length < 2) {
        const guardDogs = dogBreeds.filter(
          (breed) =>
            breed.purpose.includes("Guarda") && (breed.size.includes("Grande") || breed.size.includes("Gigante")),
        )

        // Adicionar algumas raças maiores, mas não todas
        filteredBreeds = [...filteredBreeds, ...guardDogs.slice(0, 3)]
      }
    } else {
      // Para outros casos, aplicar o filtro normal
      filteredBreeds = filteredBreeds.filter((breed) => {
        if (answers.objetivo === "companhia" && breed.purpose.includes("Companhia")) return true
        if (answers.objetivo === "guarda" && breed.purpose.includes("Guarda")) return true
        if (answers.objetivo === "esporte" && breed.purpose.includes("Esporte")) return true
        return false
      })
    }
  }

  // Se não houver raças que correspondam exatamente aos critérios, use todas as raças
  // Isso é um fallback para garantir que sempre haja resultados
  if (filteredBreeds.length === 0) {
    filteredBreeds = dogBreeds
  }

  const results = filteredBreeds.map((breed) => {
    let score = 0
    let maxScore = 0
    const warnings = []

    // Compatibilidade de espaço
    if (answers.espaco !== undefined) {
      maxScore += 10
      const spaceScore = answers.espaco / 10 // 0-10 scale

      if (breed.size.includes("Pequeno")) {
        // Cães pequenos precisam de menos espaço
        score += 10 - Math.abs(spaceScore - 3) * 1.5
      } else if (breed.size.includes("Médio")) {
        score += 10 - Math.abs(spaceScore - 5) * 1.5
      } else if (breed.size.includes("Grande")) {
        score += 10 - Math.abs(spaceScore - 7) * 1.5
      } else if (breed.size.includes("Gigante")) {
        // Cães gigantes (acima de 50kg) precisam de muito espaço
        score += 10 - Math.abs(spaceScore - 9) * 1.5

        // Adicionar aviso se o espaço for pequeno
        if (answers.espaco < 40) {
          warnings.push(
            "Cães de porte gigante precisam de bastante espaço. Recomendamos uma rotina bem estruturada de passeios diários e adestramento adequado.",
          )
        }
      }

      // Garantir que o score não seja negativo
      if (score < 0) score = 0
    }

    // Compatibilidade de tempo disponível
    if (answers.tempo) {
      maxScore += 10
      let timeScore = 0

      if (answers.tempo === "pouco") timeScore = 3
      else if (answers.tempo === "medio") timeScore = 6
      else if (answers.tempo === "muito") timeScore = 10

      // Calcular com base nas necessidades de exercício
      score += 10 - Math.abs(timeScore - breed.exerciseNeeds) * 0.8

      // Adicionar aviso se o tempo for pouco para cães que precisam de muito exercício
      if (answers.tempo === "pouco" && breed.exerciseNeeds >= 8) {
        warnings.push(
          "Esta raça precisa de bastante exercício diário. Considere aumentar o tempo disponível para atividades com o cão.",
        )
      }

      // Garantir que o score não seja negativo
      if (score < 0) score = 0
    }

    // Compatibilidade com nível de energia preferido
    if (answers.energia) {
      maxScore += 15 // Damos um peso maior para este critério
      let energyLevel = 0
      let breedEnergyLevel = 0

      // Converter o nível de energia da raça para um valor numérico
      if (breed.energyLevel.includes("Baixo")) breedEnergyLevel = 3
      else if (breed.energyLevel.includes("Médio")) breedEnergyLevel = 6
      else if (breed.energyLevel.includes("Alto")) breedEnergyLevel = 9
      else if (breed.energyLevel.includes("Muito Alto")) breedEnergyLevel = 10

      // Converter a preferência do usuário para um valor numérico
      if (answers.energia === "baixo") energyLevel = 3
      else if (answers.energia === "medio") energyLevel = 6
      else if (answers.energia === "alto") energyLevel = 9

      // Calcular a compatibilidade
      score += 15 - Math.abs(energyLevel - breedEnergyLevel) * 1.5

      // Adicionar aviso se houver grande discrepância
      if (Math.abs(energyLevel - breedEnergyLevel) > 4) {
        if (breedEnergyLevel > energyLevel) {
          warnings.push(
            "Esta raça tem um nível de energia maior do que o desejado. Será necessário proporcionar bastante atividade física.",
          )
        } else {
          warnings.push(
            "Esta raça tem um nível de energia menor do que o desejado. Pode não atender às suas expectativas de atividade.",
          )
        }
      }

      // Garantir que o score não seja negativo
      if (score < 0) score = 0
    }

    // Compatibilidade com crianças
    if (answers.criancas) {
      maxScore += 10
      if (answers.criancas === "sim") {
        score += breed.childFriendly

        // Adicionar aviso se a raça não for muito amigável com crianças
        if (breed.childFriendly < 6) {
          warnings.push(
            "Esta raça pode não ser ideal para famílias com crianças pequenas. Supervisão constante é recomendada.",
          )
        }
      } else {
        score += 10 // Se não tem crianças, qualquer raça é compatível neste aspecto
      }
    }

    // Compatibilidade com alergia
    if (answers.alergia) {
      maxScore += 10
      if (answers.alergia === "sim") {
        // Para pessoas com alergia, cães hipoalergênicos são melhores
        score += breed.shedding <= 3 ? 10 : 10 - breed.shedding

        // Adicionar aviso se a raça não for hipoalergênica
        if (breed.shedding > 5) {
          warnings.push("Esta raça não é considerada hipoalergênica e pode causar reações alérgicas.")
        }
      } else if (answers.alergia === "leve") {
        // Alergia leve pode tolerar cães com queda de pelo moderada
        score += breed.shedding <= 5 ? 8 : 10 - breed.shedding
      } else {
        // Sem alergia, qualquer raça é compatível neste aspecto
        score += 10
      }
    }

    // Compatibilidade com queda de pelos
    if (answers.queda_pelos) {
      maxScore += 10
      if (answers.queda_pelos === "muito") {
        // Prefere cães que não soltam pelos
        score += 10 - breed.shedding

        // Adicionar aviso se a raça tiver muita queda de pelos
        if (breed.shedding > 6) {
          warnings.push("Esta raça tem queda de pelos significativa, o que pode não atender às suas preferências.")
        }
      } else if (answers.queda_pelos === "pouco") {
        // Tolera alguma queda de pelos
        score += breed.shedding <= 7 ? 8 : 5
      } else {
        // Não se incomoda com queda de pelos
        score += 10
      }
    }

    // Compatibilidade com nível de experiência
    if (answers.experiencia) {
      maxScore += 10
      if (answers.experiencia === "nenhuma") {
        // Para iniciantes, raças mais fáceis de treinar são melhores
        score += breed.trainability >= 7 ? 10 : breed.trainability

        // Adicionar aviso se a raça for difícil para iniciantes
        if (breed.trainability < 6) {
          warnings.push(
            "Esta raça pode ser desafiadora para tutores de primeira viagem. Considere aulas de adestramento profissional.",
          )
        }
      } else if (answers.experiencia === "alguma") {
        // Experiência média pode lidar com raças de dificuldade média
        score += 10 - Math.abs(7 - breed.trainability)
      } else if (answers.experiencia === "muita") {
        // Muita experiência pode lidar com qualquer raça
        score += 10
      }
    }

    // Compatibilidade com nível de atividade
    if (answers.atividade) {
      maxScore += 10
      let activityLevel = 0

      if (answers.atividade === "baixo") activityLevel = 3
      else if (answers.atividade === "medio") activityLevel = 6
      else if (answers.atividade === "alto") activityLevel = 9

      score += 10 - Math.abs(activityLevel - breed.exerciseNeeds)

      // Adicionar aviso se houver grande discrepância
      if (breed.exerciseNeeds > activityLevel + 3) {
        warnings.push("Esta raça precisa de mais atividade física do que você indicou estar disposto a proporcionar.")
      }
    }

    // Compatibilidade com disponibilidade para cuidados
    if (answers.cuidados) {
      maxScore += 10
      let careLevel = 0

      if (answers.cuidados === "baixa") careLevel = 3
      else if (answers.cuidados === "media") careLevel = 6
      else if (answers.cuidados === "alta") careLevel = 9

      score += 10 - Math.abs(careLevel - breed.groomingNeeds)

      // Adicionar aviso se os cuidados necessários forem maiores que o disponível
      if (breed.groomingNeeds > careLevel + 2) {
        warnings.push("Esta raça requer mais cuidados com a pelagem do que você indicou estar disposto a proporcionar.")
      }
    }

    // Ajustes específicos para cães pequenos/médios para guarda
    if (answers.objetivo === "guarda" && (breed.size.includes("Pequeno") || breed.size.includes("Médio"))) {
      // Verificar se a raça realmente é adequada para guarda
      const isGuardDog = breed.purpose.includes("Guarda")
      const isKnownGuardBreed = [
        "Schnauzer",
        "Bull Terrier",
        "Dachshund",
        "Jack Russell Terrier",
        "Basenji",
        "Fox Terrier",
        "Spitz Alemão",
        "Pinscher",
      ].some((guardBreed) => breed.name.includes(guardBreed))

      if (isGuardDog || isKnownGuardBreed) {
        // Bônus para raças pequenas/médias que são boas para guarda
        score += 15
      } else {
        // Penalidade para raças pequenas/médias que não são adequadas para guarda
        score -= 20
      }
    }

    // Garantir que o Terra Nova não seja recomendado para guarda
    if (breed.name === "Terra Nova" && answers.objetivo === "guarda") {
      score -= 20 // Penalidade para evitar recomendar Terra Nova para guarda
    }

    // Bônus para o Japanese Chin - sempre dar uma pontuação extra para aumentar suas chances
    if (breed.name === "Japanese Chin") {
      score += 15 // Bônus significativo para o Japanese Chin
    }

    // Calcular porcentagem de compatibilidade
    const matchPercentage = Math.round((score / maxScore) * 100)

    return {
      breed,
      matchPercentage: Math.min(matchPercentage, 100), // Garantir que não ultrapasse 100%
      warnings: warnings,
    }
  })

  return results
}
