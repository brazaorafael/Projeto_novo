import os
import requests
from urllib.parse import quote
import time
import json

# Lista de raças que precisamos
dog_breeds = [
    "Akita", "Australian Shepherd", "Basset Hound", "Bernese Mountain Dog", 
    "Bichon Frisé", "Boxer", "Bull Terrier", "Cane Corso", 
    "Cavalier King Charles Spaniel", "Chihuahua", "Chow Chow", "Cocker Spaniel", 
    "Collie", "Corgi", "Dálmata", "Doberman", "Dogo Argentino", 
    "Dogue Alemão", "Fila Brasileiro", "Fox Terrier", "Greyhound", 
    "Husky Siberiano", "Jack Russell Terrier", "Lhasa Apso", 
    "Malamute do Alasca", "Maltês", "Mastiff", "Papillon", "Pequinês", 
    "Pit Bull", "Pointer", "Pug", "Samoieda", "São Bernardo", "Schnauzer", 
    "Setter Irlandês", "Shar Pei", "Spitz Alemão", "Staffordshire Bull Terrier", 
    "Weimaraner", "West Highland White Terrier", "Whippet", "Yorkshire Terrier"
]

# Diretório onde as imagens serão salvas
output_dir = "public/images/breeds"
os.makedirs(output_dir, exist_ok=True)

# Arquivo para rastrear quais raças já foram baixadas
log_file = "scripts/downloaded_breeds.json"
downloaded_breeds = {}

# Carregar registro de raças já baixadas, se existir
if os.path.exists(log_file):
    with open(log_file, 'r') as f:
        downloaded_breeds = json.load(f)

# Função para converter nome da raça para nome de arquivo
def breed_to_filename(breed):
    return breed.lower().replace(" ", "-")

# API do Unsplash para buscar imagens (você precisaria de uma chave de API)
# Alternativamente, podemos usar a API do Dog CEO que é gratuita e não requer chave
def download_image(breed):
    breed_filename = breed_to_filename(breed)
    output_path = f"{output_dir}/{breed_filename}.jpg"
    
    # Verificar se já baixamos esta raça
    if breed in downloaded_breeds and os.path.exists(output_path):
        print(f"Já temos imagem para {breed}")
        return True
    
    # Usar a API Dog CEO para raças reconhecidas
    # Nota: Esta API não tem todas as raças, então algumas podem falhar
    try:
        # Converter nome da raça para o formato da API
        api_breed = breed.lower().replace(" ", "/")
        
        # Para algumas raças específicas, ajustar o nome para a API
        breed_mapping = {
            "boxer": "boxer",
            "bulldog": "bulldog/english",
            "chihuahua": "chihuahua",
            "collie": "collie/border",
            "corgi": "corgi/cardigan",
            "dálmata": "dalmatian",
            "doberman": "doberman",
            "husky siberiano": "husky",
            "maltês": "maltese",
            "pug": "pug",
            "são bernardo": "stbernard",
            "schnauzer": "schnauzer/miniature",
            "yorkshire terrier": "terrier/yorkshire"
        }
        
        if breed.lower() in breed_mapping:
            api_breed = breed_mapping[breed.lower()]
        
        url = f"https://dog.ceo/api/breed/{api_breed}/images/random"
        response = requests.get(url)
        data = response.json()
        
        if data["status"] == "success":
            image_url = data["message"]
            img_response = requests.get(image_url)
            
            if img_response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(img_response.content)
                print(f"Imagem baixada para {breed}")
                downloaded_breeds[breed] = {"url": image_url, "path": output_path}
                return True
    except Exception as e:
        print(f"Erro ao baixar {breed} da API Dog CEO: {e}")
    
    # Se falhar com a API Dog CEO, tentar com a API do Pexels
    # Nota: Você precisaria de uma chave de API do Pexels
    try:
        # Aqui você usaria a API do Pexels ou outra API de imagens
        # Este é apenas um exemplo e não funcionará sem uma chave de API
        print(f"Tentando API alternativa para {breed}...")
        # Código para API alternativa aqui
        return False
    except Exception as e:
        print(f"Erro ao baixar {breed} da API alternativa: {e}")
    
    return False

# Baixar imagens para cada raça
failed_breeds = []
for breed in dog_breeds:
    print(f"Buscando imagem para {breed}...")
    success = download_image(breed)
    if not success:
        failed_breeds.append(breed)
    time.sleep(1)  # Pausa para não sobrecarregar a API

# Salvar registro de raças baixadas
with open(log_file, 'w') as f:
    json.dump(downloaded_breeds, f, indent=2)

# Imprimir raças que falharam
if failed_breeds:
    print("\nRaças que não conseguimos baixar imagens:")
    for breed in failed_breeds:
        print(f"- {breed}")
else:
    print("\nTodas as imagens foram baixadas com sucesso!")

print("\nProcesso concluído!")
