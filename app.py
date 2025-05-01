import streamlit as st
import pandas as pd

# Carregar os dados da planilha
@st.cache_data
def load_data():
    df = pd.read_csv('Tabela_com_Porte_Preenchido.csv')
    porte_row = df.iloc[0]
    objetivo_row = df.iloc[7]
    criterios = df.iloc[1:8]
    return porte_row, objetivo_row, criterios

porte_row, objetivo_row, criterios = load_data()

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

    # Filtrar raças por porte e objetivo
    raças = criterios.columns[1:]
    raças_filtradas = []
    for r in raças:
        valor_raw = porte_row.get(r, "")
        valor_porte = str(valor_raw).strip().lower() if pd.notna(valor_raw) else ""
        valor_objetivo = str(objetivo_row[r]).strip().lower() if pd.notna(objetivo_row[r]) else ""
        if valor_porte == porte_familia.lower() and objetivo_familia.lower() in valor_objetivo:
            raças_filtradas.append(r)

    resultados = []
    for r in raças_filtradas:
        penalidade = 0

        # Aproximação
        penalidade += abs(respostas_aprox["Nível de energia"] - int(criterios.loc["Nível de energia", r]))
        penalidade += abs(respostas_aprox["Convivência com crianças"] - int(criterios.loc["Tolerância a crianças", r]))
        penalidade += abs(respostas_aprox["Sociabilidade com outros animais"] - int(criterios.loc["Sociabilidade com outros animais", r]))
        penalidade += abs(respostas_aprox["Facilidade de adestramento"] - int(criterios.loc["Facilidade de adestramento", r]))
        penalidade += abs(respostas_aprox["Tempo disponível para cuidados"] - int(criterios.loc["Tempo de cuidados (pelagem, etc)", r]))

        # Suficiência (com peso de penalidade 3)
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
        st.markdown(f"**Porte:** {porte_row[raca]}")
        st.markdown(f"**Objetivo principal:** {objetivo_row[raca]}")
        st.markdown(f"**Match:** {match_percent}%")
        st.markdown("---")