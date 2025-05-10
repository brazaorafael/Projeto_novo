const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")

// Verificar se o diretório de imagens existe, se não, criar
const imagesDir = path.join(process.cwd(), "public", "images", "breeds")
if (!fs.existsSync(imagesDir)) {
  console.log("Criando diretório de imagens...")
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Executar o script Python
console.log("Iniciando download de imagens...")
exec("python scripts/download_dog_images.py", (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o script: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Erro no script: ${stderr}`)
    return
  }
  console.log(stdout)
  console.log("Download de imagens concluído!")
})
