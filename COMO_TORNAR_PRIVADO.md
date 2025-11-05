# 🔒 Como Tornar o Repositório Privado no GitHub

## Passo a Passo

### 1. Acesse o Repositório no GitHub

1. Abra seu navegador e vá para: https://github.com/RohasBR/Rohas-4.0
2. Faça login na sua conta GitHub (rohas@decolaeventos.com.br)

### 2. Acesse as Configurações

1. Clique na aba **"Settings"** (Configurações) no topo do repositório
2. Se não vir a aba "Settings", você precisa ter permissões de administrador no repositório

### 3. Alterar Visibilidade

1. No menu lateral esquerdo, role até a seção **"Danger Zone"** (Zona de Perigo)
2. Clique em **"Change visibility"** (Alterar visibilidade)
3. Selecione **"Make private"** (Tornar privado)
4. Digite o nome do repositório (`RohasBR/Rohas-4.0`) para confirmar
5. Clique em **"I understand, change repository visibility"** (Eu entendo, alterar visibilidade do repositório)

### 4. Confirmação

- O repositório agora será privado
- Apenas você e colaboradores que você adicionar poderão ver o repositório
- Os dados financeiros estarão protegidos

## Alternativa: Via Linha de Comando

Se você tiver o GitHub CLI instalado:

```bash
gh repo edit RohasBR/Rohas-4.0 --visibility private
```

## Nota Importante

⚠️ **Atenção**: Ao tornar o repositório privado:
- Os dados financeiros não estarão mais públicos
- Apenas você e colaboradores autorizados terão acesso
- O histórico de commits permanecerá intacto

## Adicionar Colaboradores (Opcional)

Se você quiser dar acesso a outras pessoas:

1. Vá em **Settings** → **Collaborators** (Colaboradores)
2. Clique em **"Add people"** (Adicionar pessoas)
3. Digite o username ou email do GitHub da pessoa
4. Selecione o nível de permissão (Read, Write, ou Admin)
5. A pessoa receberá um convite por email

