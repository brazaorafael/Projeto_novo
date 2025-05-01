
import streamlit as st
import pandas as pd
import re

CSV_FILE = "Tabela_com_Porte_Preenchido.csv"

# ---------------------------
@st.cache_data
def load_data(path: str):
    df = pd.read_csv(path)
    df.set_index("Critério", inplace=True)

    porte_dict    = {c: str(df.loc["Porte", c]).strip().lower() for c in df.columns}
    objetivo_dict = {c: str(df.loc["Compatível com o objetivo da família", c]).strip().lower() for c in df.columns}
    foto_dict     = {c: df.loc["Link da Foto", c] for c in df.columns}
    canil_dict    = {c: df.loc["Canil (com link)", c] for c in df.columns}

    criterios = df.loc[
        ["Nível de energia",
         "Necessidade de espaço",
         "Tolerância a crianças",
         "Sociabilidade com outros animais",
         "Tempo de cuidados (pelagem, etc)",
         "Facilidade de adestramento",
         "Compatibilidade com recursos financeiros"]
    ]
    return criterios, porte_dict, objetivo_dict, foto_dict, canil_dict

criterios, porte_dict, objetivo_dict, foto_dict, canil_dict = load_data(CSV_FILE)

# ------------- UI -------------
st.title("Match de Raças de Cães para Famílias")
st.caption("Build com fotos & canil – 2025‑05‑01")

st.subheader("1. Perfil da Família")
porte_familia = st.selectbox("Qual porte de cão você deseja?", ["Pequeno", "Médio", "Grande"])
objetivo_familia = st.selectbox("Qual o principal objetivo com o cão?", ["Companhia", "Guarda e Proteção", "Esporte e Hobby"])

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

if st.button("Ver Raças Recomendadas"):
    racas_validas = [
        r for r in criterios.columns
        if porte_dict[r] == porte_familia.lower()
        and objetivo_familia.lower() in objetivo_dict[r]
    ]

    if not racas_validas:
        st.warning("Nenhuma raça encontrada para esse filtro.")
        st.stop()

    resultados = []
    for r in racas_validas:
        pena = 0
        for crit in respostas_aprox:
            pena += abs(respostas_aprox[crit] - float(criterios.loc[crit, r]))

        # suficiência
        esp = float(criterios.loc["Necessidade de espaço", r])
        if respostas_suf["Necessidade de espaço"] < esp:
            pena += (esp - respostas_suf["Necessidade de espaço"]) * 3

        rec = float(criterios.loc["Compatibilidade com recursos financeiros", r])
        if respostas_suf["Compatibilidade com recursos financeiros"] < rec:
            pena += (rec - respostas_suf["Compatibilidade com recursos financeiros"]) * 3

        resultados.append((r, pena))

    resultados.sort(key=lambda x: x[1])

    st.subheader("Raças Recomendadas")
    for r, score in resultados[:3]:
        match_percent = max(0, 100 - score * 4)
        col1, col2 = st.columns([1,2])

        with col1:
            if pd.notna(foto_dict[r]) and str(foto_dict[r]).startswith("http"):
                st.image(foto_dict[r], use_column_width=True)
            else:
                st.markdown("*(sem foto)*")

        with col2:
            st.markdown(f"### {r}")
            st.markdown(f"**Porte:** {porte_dict[r].capitalize()}")
            st.markdown(f"**Objetivo principal:** {objetivo_dict[r].capitalize()}")
            st.markdown(f"**Compatibilidade estimada:** {match_percent:.0f}%")

            canil_raw = str(canil_dict[r]) if pd.notna(canil_dict[r]) else ""
            if canil_raw and "(" in canil_raw and ")" in canil_raw:
                nome = canil_raw.split("(")[0].strip()
                link = re.search(r"\((.*?)\)", canil_raw).group(1)
                st.markdown("#### Criador recomendado")
                st.markdown(f"[{nome}]({link})")
            elif canil_raw:
                st.markdown("#### Criador recomendado")
                st.markdown(canil_raw)
            else:
                st.markdown("#### Criador recomendado")
                st.write("Informação não cadastrada.")
        st.markdown("---")
