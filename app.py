
import streamlit as st
import pandas as pd
import math

CSV_FILE = "Tabela_com_Porte_Preenchido.csv"

# --------------------------
# Função para carregar dados
# --------------------------
@st.cache_data
def load_data(path: str):
    df = pd.read_csv(path)

    # 1. transformar a coluna 'Critério' em índice
    df.set_index("Critério", inplace=True)

    # 2. criar dicionários de porte e objetivo já normalizados
    porte_dict = {col: str(df.loc["Porte", col]).strip().lower()
                  for col in df.columns}

    objetivo_dict = {col: str(df.loc["Compatível com o objetivo da família", col]).strip().lower()
                     for col in df.columns}

    # 3. selecionar somente as linhas numéricas que vamos usar
    criterios = df.loc[
        ["Nível de energia",
         "Necessidade de espaço",
         "Tolerância a crianças",
         "Sociabilidade com outros animais",
         "Tempo de cuidados (pelagem, etc)",
         "Facilidade de adestramento",
         "Compatibilidade com recursos financeiros"]
    ]
    return criterios, porte_dict, objetivo_dict

# Carrega
criterios, porte_dict, objetivo_dict = load_data(CSV_FILE)

# --------------------------------
# Interface de perguntas ao usuário
# --------------------------------
st.title("Match de Raças de Cães para Famílias")
st.caption("Versão build: 2025‑05‑01 12:10")

st.subheader("1. Perfil da Família")
porte_familia = st.selectbox(
    "Qual porte de cão você deseja?",
    ["Pequeno", "Médio", "Grande"]
)

objetivo_familia = st.selectbox(
    "Qual o principal objetivo com o cão?",
    ["Companhia", "Guarda e Proteção", "Esporte e Hobby"]
)

st.subheader("2. Preferências e Realidade da Família")
respostas_aprox = {
    "Nível de energia": st.slider("Nível de energia desejado", 1, 5, 3),
    "Tolerância a crianças": st.slider("Convivência com crianças", 1, 5, 3),
    "Sociabilidade com outros animais": st.slider("Sociabilidade com outros animais", 1, 5, 3),
    "Facilidade de adestramento": st.slider("Facilidade de adestramento", 1, 5, 3),
    "Tempo de cuidados (pelagem, etc)": st.slider("Tempo disponível para cuidados", 1, 5, 3)
}

respostas_suf = {
    "Necessidade de espaço": st.slider("Espaço disponível", 1, 5, 3),
    "Compatibilidade com recursos financeiros": st.slider("Recursos financeiros disponíveis", 1, 5, 3)
}

# ---------------------------
# Botão de cálculo de resultado
# ---------------------------
if st.button("Ver Raças Recomendadas"):
    # 1. Filtrar por porte e objetivo
    racas_filtradas = [
        r for r in criterios.columns
        if porte_dict.get(r, "") == porte_familia.lower()
        and objetivo_familia.lower() in objetivo_dict.get(r, "")
    ]

    if not racas_filtradas:
        st.warning("Nenhuma raça encontrada para esse porte/objetivo.")
        st.stop()

    resultados = []
    for r in racas_filtradas:
        penalidade = 0

        # Critérios por aproximação (diferença absoluta)
        for crit in respostas_aprox:
            valor_raca = float(criterios.loc[crit, r])
            penalidade += abs(respostas_aprox[crit] - valor_raca)

        # Critérios por suficiência
        espaco_raca = float(criterios.loc["Necessidade de espaço", r])
        if respostas_suf["Necessidade de espaço"] < espaco_raca:
            penalidade += (espaco_raca - respostas_suf["Necessidade de espaço"]) * 3

        recurso_raca = float(criterios.loc["Compatibilidade com recursos financeiros", r])
        if respostas_suf["Compatibilidade com recursos financeiros"] < recurso_raca:
            penalidade += (recurso_raca - respostas_suf["Compatibilidade com recursos financeiros"]) * 3

        resultados.append((r, penalidade))

    # Ordenar
    resultados.sort(key=lambda x: x[1])

    st.subheader("Raças Recomendadas")
    for raca, score in resultados[:3]:
        match_percent = max(0, 100 - score * 4)  # escala simples
        st.markdown(f"### {raca}")
        st.markdown(f"**Porte:** {porte_dict[raca].capitalize()}")
        st.markdown(f"**Objetivo principal:** {objetivo_dict[raca].capitalize()}")
        st.markdown(f"**Compatibilidade estimada:** {match_percent:.0f}%")
        st.markdown("---")
