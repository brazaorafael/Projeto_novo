# Match de Raças de Cães para Famílias

Esta é uma aplicação em **Streamlit** que recomenda as melhores raças de cães para uma família com base em seu perfil, preferências e realidade.

## Funcionalidades

- Filtra raças por **porte** e **objetivo da família**
- Aplica critérios de **proximidade** e **suficiência**
- Calcula um **% de compatibilidade**
- Retorna as **3 raças mais compatíveis**
- Exibe porte, objetivo e o motivo da recomendação

## Como usar

1. Acesse o app publicado no [Streamlit Cloud](https://streamlit.io/cloud)
2. Escolha o porte e o objetivo desejado com o cão
3. Responda às perguntas com base na sua realidade
4. Veja as raças recomendadas com % de compatibilidade

## Como rodar localmente

Clone este repositório:

```bash
git clone https://github.com/seu-usuario/match-de-racas.git
cd match-de-racas
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o app:

```bash
streamlit run app.py
```

## Estrutura dos dados

A planilha `Tabela_com_Porte_Preenchido.csv` contém:

- Características de cada raça (nível de energia, espaço, etc.)
- Linha de **porte da raça**
- Linha de **objetivo da raça**

## Autor

Projeto desenvolvido por [Seu Nome].