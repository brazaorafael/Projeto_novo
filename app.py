
import streamlit as st
import pandas as pd
import re

CSV_FILE = "Tabela_Final_Atualizada.csv"

@st.cache_data
def load_data(path: str):
    df = pd.read_csv(path)
    df.set_index("Critério", inplace=True)

    porte = {c: str(df.loc["Porte", c]).strip().lower() for c in df.columns}
    objetivo = {c: str(df.loc["Compatível com o objetivo da família", c]).strip().lower() for c in df.columns}
    foto = {c: df.loc["Link da Foto", c] for c in df.columns}
    canil = {c: df.loc["Canil (com link)", c] for c in df.columns}
    desc  = {c: df.loc["Descrição", c] for c in df.columns}

    criterios = df.loc[
        ["Nível de energia",
         "Necessidade de espaço",
         "Tolerância a crianças",
         "Sociabilidade com outros animais",
         "Tempo de cuidados (pelagem, etc)",
         "Facilidade de adestramento",
         "Compatibilidade com recursos financeiros"]
    ]
    return criterios, porte, objetivo, foto, canil, desc

criterios, porte_dict, objetivo_dict, foto_dict, canil_dict, desc_dict = load_data(CSV_FILE)

st.title("Match de Raças de Cães para Famílias")
st.caption("Build com descrição da raça – 2025‑05‑01")

st.subheader("1. Perfil da Família")
porte_fam = st.selectbox("Qual porte de cão você deseja?", ["Pequeno", "Médio", "Grande"])
obj_fam = st.selectbox("Qual o principal objetivo com o cão?", ["Companhia", "Guarda e Proteção", "Esporte e Hobby"])

st.subheader("2. Preferências e Realidade da Família")
resp_aprox = {
    "Nível de energia": st.slider("Nível de energia desejado", 1, 5, 3),
    "Tolerância a crianças": st.slider("Convivência com crianças", 1, 5, 3),
    "Sociabilidade com outros animais": st.slider("Sociabilidade com outros animais", 1, 5, 3),
    "Facilidade de adestramento": st.slider("Facilidade de adestramento", 1, 5, 3),
    "Tempo de cuidados (pelagem, etc)": st.slider("Tempo disponível para cuidados", 1, 5, 3)
}
resp_suf = {
    "Necessidade de espaço": st.slider("Espaço disponível", 1, 5, 3),
    "Compatibilidade com recursos financeiros": st.slider("Recursos financeiros disponíveis", 1, 5, 3)
}

if st.button("Ver Raças Recomendadas"):
    racas = [
        r for r in criterios.columns
        if porte_dict[r] == porte_fam.lower() and obj_fam.lower() in objetivo_dict[r]
    ]

    if not racas:
        st.warning("Nenhuma raça encontrada.")
        st.stop()

    resultados = []
    for r in racas:
        pena = 0
        for crit in resp_aprox:
            pena += abs(resp_aprox[crit] - float(criterios.loc[crit, r]))

        esp = float(criterios.loc["Necessidade de espaço", r])
        if resp_suf["Necessidade de espaço"] < esp:
            pena += (esp - resp_suf["Necessidade de espaço"]) * 3

        rec = float(criterios.loc["Compatibilidade com recursos financeiros", r])
        if resp_suf["Compatibilidade com recursos financeiros"] < rec:
            pena += (rec - resp_suf["Compatibilidade com recursos financeiros"]) * 3

        resultados.append((r, pena))

    resultados.sort(key=lambda x: x[1])

    st.subheader("Raças Recomendadas")
    for r, score in resultados[:3]:
        match_pct = max(0, 100 - score * 4)
        col1, col2 = st.columns([1,2])

        with col1:
            url = str(foto_dict[r])
            if url.startswith("http"):
                st.image(url, use_container_width=True)
            else:
                st.write("*(sem foto)*")

        with col2:
            st.markdown(f"### {r}")
            st.markdown(f"**Porte:** {porte_dict[r].capitalize()}")
            st.markdown(f"**Objetivo principal:** {objetivo_dict[r].capitalize()}")
            st.markdown(f"**Compatibilidade estimada:** {match_pct:.0f}%")
            st.markdown(f"**Descrição:** {desc_dict[r]}")
            st.markdown("#### Criador recomendado")
            raw = str(canil_dict[r]) if pd.notna(canil_dict[r]) else ""
            if "(" in raw and ")" in raw:
                nome = raw.split("(")[0].strip()
                link = re.search(r"\((.*?)\)", raw).group(1)
                st.markdown(f"[{nome}]({link})")
            elif raw:
                st.markdown(raw)
            else:
                st.write("Informação não cadastrada.")
        st.markdown("---")
