# 🔒 Arquivos Excel Protegidos por Senha

## Problema Identificado

Os arquivos Excel na pasta `data/` estão protegidos por senha, o que impede o processamento automático dos dados.

## Solução

Você precisa remover a senha dos arquivos Excel antes de processá-los. Siga os passos abaixo:

### Opção 1: Remover Senha no Excel (Recomendado)

1. Abra cada arquivo Excel no Microsoft Excel
2. Vá em **Arquivo** → **Informações** → **Proteger Pasta de Trabalho**
3. Selecione **Criptografar com Senha**
4. Digite a senha atual e depois deixe em branco para remover a senha
5. Salve o arquivo

### Opção 2: Usar Script Python (Automático)

Você pode usar um script Python para remover a senha de todos os arquivos de uma vez:

```python
import openpyxl
import os

data_dir = './data'
password = 'SUA_SENHA_AQUI'  # Substitua pela senha real

for filename in os.listdir(data_dir):
    if filename.endswith('.xlsx'):
        filepath = os.path.join(data_dir, filename)
        try:
            # Tentar abrir com senha
            wb = openpyxl.load_workbook(filepath, password=password)
            # Salvar sem senha
            wb.save(filepath)
            print(f'Senha removida de: {filename}')
        except Exception as e:
            print(f'Erro ao processar {filename}: {e}')
```

### Opção 3: Carregar Arquivos Manualmente

Enquanto os arquivos estiverem protegidos, você pode:

1. Abrir cada arquivo no Excel
2. Salvar uma cópia sem senha
3. Usar o botão "Carregar e Analisar" para selecionar os arquivos manualmente

## Após Remover a Senha

Depois de remover a senha dos arquivos:

1. Substitua os arquivos na pasta `data/` pelos arquivos sem senha
2. Clique no botão **"Carregar Arquivos Padrão (Pasta Data)"** novamente
3. Os dados serão processados automaticamente

## Nota Importante

⚠️ **Atenção**: Mantenha backup dos arquivos originais antes de remover a senha, caso necessário.

