import streamlit as st
import pandas as pd

# Carregar os dados da planilha
@st.cache_data
def load_data():
    df = pd.read_csv("Tabela_com_Porte_Preenchido.csv")

    # Extrair linha de porte e linha de objetivo
    porte_dict = {}
    objetivo_dict = {}
    for col in df.columns[1:]:
        porte_raw = df.iloc[0][col]
        objetivo_raw = df.iloc[7][col]
        try:
            porte_dict[col] = str(porte_raw).strip().lower()
        except:
            porte_dict[col] = ""
        try:
            objetivo_dict[col] = str(objetivo_raw).strip().lower()
        except:
            objetivo_dict[col] = ""

    criterios = df.iloc[1:8]  # Linhas com critérios
    return criterios, porte_dict, objetivo_dict

criterios, porte_dict, objetivo_dict = load_data()

# Interface
st.title("Match de Raças de Cães para Famílias")

st.subheader("1. Perfil da Família")

porte_familia = st.selectbox("Qual porte de cão você deseja?", ["Pequeno", "Médio", "Grande"])
objetivo_familia = st.selectbox("Qual o principal objetivo com o cão?", [
    "Companhia", "Guarda e Proteção", "Esporte e Hobby"
])

st.subheader("2. Preferências e Realidade da Família")

respostas_aprox = {
    "Nível de energia": st.slider("Nível de energia desejado", 1, 5, 3),
    "Convivência com crianças": st.slider("Compatível com crianças?", 1, 5, 3),
    "Sociabilidade com outros animais": st.slider("Sociabilidade com outros animais", 1, 5, 3),
    "Facilidade de adestramento": st.slider("Facilidade de adestramento", 1, 5, 3),
    "Tempo disponível para cuidados": st.slider("Tempo disponível para cuidados", 1, 5, 3)
}

respostas_suf = {
    "Necessidade de espaço": st.slider("Espaço disponível", 1, 5, 3),
    "Compatibilidade com recursos financeiros": st.slider("Recursos financeiros disponíveis", 1, 5, 3)
}

if st.button("Ver Raças Recomendadas"):

    raças_filtradas = []
    for r in criterios.columns[1:]:
        porte = porte_dict.get(r, "")
        objetivo = objetivo_dict.get(r, "")
        if porte == porte_familia.lower() and objetivo_familia.lower() in objetivo:
            raças_filtradas.append(r)

    resultados = []
    for r in raças_filtradas:
        penalidade = 0

        # Critérios por aproximação
        penalidade += abs(respostas_aprox["Nível de energia"] - int(criterios.loc["Nível de energia", r]))
        penalidade += abs(respostas_aprox["Convivência com crianças"] - int(criterios.loc["Tolerância a crianças", r]))
        penalidade += abs(respostas_aprox["Sociabilidade com outros animais"] - int(criterios.loc["Sociabilidade com outros animais", r]))
        penalidade += abs(respostas_aprox["Facilidade de adestramento"] - int(criterios.loc["Facilidade de adestramento", r]))
        penalidade += abs(respostas_aprox["Tempo disponível para cuidados"] - int(criterios.loc["Tempo de cuidados (pelagem, etc)", r]))

        # Critérios por suficiência
        espaco = int(criterios.loc["Necessidade de espaço", r])
        if respostas_suf["Necessidade de espaço"] < espaco:
            penalidade += (espaco - respostas_suf["Necessidade de espaço"]) * 3

        recursos = int(criterios.loc["Compatibilidade com recursos financeiros", r])
        if respostas_suf["Compatibilidade com recursos financeiros"] < recursos:
            penalidade += (recursos - respostas_suf["Compatibilidade com recursos financeiros"]) * 3

        resultados.append((r, penalidade))

    resultados.sort(key=lambda x: x[1])
    st.subheader("Raças Recomendadas")

    if not resultados:
        st.warning("Nenhuma raça compatível foi encontrada com os filtros escolhidos.")
    for raca, score in resultados[:3]:
        match_percent = max(0, 100 - score * 4)
        st.markdown(f"### {raca}")
        st.markdown(f"**Porte:** {porte_dict.get(raca, '').capitalize()}")
        st.markdown(f"**Objetivo principal:** {objetivo_dict.get(raca, '').capitalize()}")
        st.markdown(f"**Match:** {match_percent}%")
        st.markdown("---")