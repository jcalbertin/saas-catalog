# SAAS Catalog API

## Descrição
API de catálogo de produtos multi-tenant desenvolvida com NestJS, oferecendo um sistema completo de gerenciamento de produtos e categorias com autenticação e autorização.

## Tecnologias Principais
- NestJS
- TypeORM
- PostgreSQL
- TypeScript
- JWT para autenticação

## Requisitos do Sistema
- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## Estrutura do Projeto
```
src/
├── auth/         # Módulo de autenticação
├── categories/   # Módulo de categorias
├── config/       # Configurações do projeto
├── entities/     # Entidades do TypeORM
├── products/     # Módulo de produtos
├── tenants/      # Módulo de multi-tenancy
├── app.module.ts # Módulo principal
└── main.ts       # Ponto de entrada da aplicação
```

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd saas-catalog-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=saas_catalog
DATABASE_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1d

# Domain Configuration
BASE_DOMAIN=catali.com
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id

# File Upload Configuration
MAX_FILE_SIZE=5242880 # 5MB
UPLOAD_DESTINATION=./uploads

# App Configuration
PORT=3001
NODE_ENV=development
```

4. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
npm run typeorm:migration:run
```

6. Inicie o servidor:
```bash
npm run start:dev
```

## Principais Funcionalidades

### Autenticação
- Sistema de login e registro
- Autenticação baseada em JWT
- Controle de acesso baseado em roles

### Produtos
- CRUD completo de produtos
- Associação com categorias
- Filtros e paginação
- Suporte a imagens

### Categorias
- Gerenciamento hierárquico de categorias
- Associação com produtos
- Filtros e busca

### Multi-tenancy e Subdomínios
- Isolamento de dados por tenant
- Gerenciamento de tenants
- Configurações específicas por tenant
- Sistema automático de criação de subdomínios

#### Fluxo de Criação de Subdomínios
1. Novo tenant é criado
2. DomainService valida o subdomínio
3. Cloudflare API cria registro CNAME
4. DNS propaga o novo subdomínio
5. Nginx roteia requisições para a API
6. API identifica o tenant pelo subdomínio

#### Componentes do Sistema
- **DomainService**: Gerencia a criação e deleção de subdomínios via Cloudflare API
- **TenantMiddleware**: Identifica o tenant atual baseado no subdomínio
- **Nginx**: Atua como proxy reverso, redirecionando requisições para a API
- **Cloudflare**: Fornece gerenciamento de DNS e segurança

#### Configuração do Nginx
O Nginx é configurado para rotear tráfego de subdomínios:
```nginx
# Configuração para subdomínios (*.catali.com)
server {
    listen 80;
    server_name *.catali.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## API Endpoints

### Autenticação
- POST /auth/login - Login de usuário
- POST /auth/register - Registro de novo usuário

### Produtos
- GET /products - Lista produtos
- POST /products - Cria novo produto
- GET /products/:id - Obtém produto específico
- PATCH /products/:id - Atualiza produto
- DELETE /products/:id - Remove produto

### Categorias
- GET /categories - Lista categorias
- POST /categories - Cria nova categoria
- GET /categories/:id - Obtém categoria específica
- PATCH /categories/:id - Atualiza categoria
- DELETE /categories/:id - Remove categoria

### Tenants
- GET /tenants - Lista tenants
- POST /tenants - Cria novo tenant
- GET /tenants/:id - Obtém tenant específico
- PATCH /tenants/:id - Atualiza tenant
- DELETE /tenants/:id - Remove tenant

## Documentação da API
A documentação completa da API está disponível através do Swagger UI em:
```
http://localhost:3001/api
```

## Testes
Para executar os testes:
```bash
# testes unitários
npm run test

# testes e2e
npm run test:e2e

# cobertura de testes
npm run test:cov
```

## Contribuição
Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter pull requests.

## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).


## Curls:

# 1. Register a new user
curl -X POST 'http://localhost:3000/auth/register' \
-H 'Content-Type: application/json' \
-d '{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user",
  "tenant_id": 1
}'

# 2. Login
curl -X POST 'http://localhost:3000/auth/login' \
-H 'Content-Type: application/json' \
-d '{
  "username": "newuser",
  "password": "password123"
}'

# Get all categories
curl -X GET 'http://localhost:3000/categories' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'

# Get category by ID
curl -X GET 'http://localhost:3000/categories/1' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'

# Create new category
curl -X POST 'http://localhost:3000/categories' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
  "name": "Electronics",
  "description": "Electronic products and gadgets"
}'

# Update category
curl -X PATCH 'http://localhost:3000/categories/1' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
  "name": "Updated Electronics",
  "description": "Updated description"
}'

# Delete category
curl -X DELETE 'http://localhost:3000/categories/1' \
-H 'Authorization: Bearer YOUR_JWT_TOKEN'

## Associando tenant e user

# 1. Create a tenant first
curl -X POST 'http://localhost:3000/tenants' \
-H 'Content-Type: application/json' \
-d '{
  "name": "My Company",
  "subdomain": "mycompany",
  "store_name": "My Store",
  "country_id": 1,
  "business_document": "123456789",
  "whatsapp_number": "+1234567890",
  "address": "123 Main St",
  "city": "New York"
}'

# 2. Register a user with the tenant_id
curl -X POST 'http://localhost:3000/auth/register' \
-H 'Content-Type: application/json' \
-d '{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user",
  "tenant_id": 1  # Use the ID of the tenant you created
}'

> Important notes:

The relationship between User and Tenant is a Many-to-One relationship, meaning:
Multiple users can belong to one tenant
Each user must belong to exactly one tenant
The tenant_id field in the User entity is required
When creating a new tenant, make sure to:
Use a unique subdomain
Provide a valid country_id
When registering a user:
The tenant_id must be valid (must exist in the tenants table)
The username and email must be unique across all tenants
After registration, all API requests from this user will automatically include their tenant context through the JWT token
The system is designed to be multi-tenant, so all operations (categories, products, etc.) will be automatically scoped to the user's tenant through the JWT token.

## Subscription Plans

O gerenciamento de planos de assinatura é restrito a usuários administradores (role: 'admin'),
exceto pela listagem de planos ativos que é pública para permitir que novos lojistas visualizem os planos disponíveis.

Rotas públicas (não requerem autenticação):
GET    /subscription-plans/public    - Listar planos ativos (público)

Rotas protegidas (requerem autenticação):
POST   /subscription-plans           - Criar novo plano (somente admin)
GET    /subscription-plans           - Listar todos os planos (somente admin)
GET    /subscription-plans/:id       - Obter um plano específico (somente admin)
PATCH  /subscription-plans/:id       - Atualizar um plano (somente admin)
PATCH  /subscription-plans/:id/deactivate - Desativar um plano (somente admin)
DELETE /subscription-plans/:id       - Remover um plano (somente admin)

{
  "name": "Basic Plan",
  "price": 29.99,
  "interval": "monthly",
  "description": "Perfect for small businesses",
  "features": {
    "maxProducts": 100,
    "support": "email",
    "customDomain": false
  },
  "product_limit": 100,
  "user_limit": 5
}

## Curls:

GET /products?page=1&limit=10&search=camiseta&categoryId=1&minPrice=10&maxPrice=100&sortBy=price&sortOrder=ASC

{
  "items": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}