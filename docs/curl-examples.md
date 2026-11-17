# Curl Request Examples

## Base URL

```bash
http://localhost:5000/api/v1
```

## 1) Health check

```bash
curl http://localhost:5000/api/v1/health
```

## 2) Login as admin

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "replace-with-your-admin-password"
  }'
```

## 3) Get current authenticated admin

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 4) Get public projects

```bash
curl http://localhost:5000/api/v1/projects?page=1&limit=10
```

## 5) Get project by slug

```bash
curl http://localhost:5000/api/v1/projects/api-platform
```

## 6) Create a project (admin)

```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "title=API Platform" \
  -F "description=Modern backend platform" \
  -F "longDescription=A production-ready platform for managing operations and analytics." \
  -F "featured=true" \
  -F "displayOrder=1" \
  -F "liveUrl=https://example.com" \
  -F "repoUrl=https://github.com/example/api-platform" \
  -F "techStack=Node.js" \
  -F "techStack=PostgreSQL" \
  -F "techStack=Express" \
  -F "image=@./path/to/project-image.jpg"
```

## 7) Update a project (admin)

```bash
curl -X PUT http://localhost:5000/api/v1/projects/:id \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "title=Updated API Platform" \
  -F "description=Updated backend platform" \
  -F "featured=true" \
  -F "displayOrder=2" \
  -F "liveUrl=https://updated-example.com" \
  -F "repoUrl=https://github.com/example/updated-api-platform" \
  -F "techStack=Node.js" \
  -F "techStack=Express" \
  -F "techStack=React"
```

## 8) Delete a project (admin)

```bash
curl -X DELETE http://localhost:5000/api/v1/projects/:id \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 9) Submit a service request

```bash
curl -X POST http://localhost:5000/api/v1/service-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+123456789",
    "serviceType": "Website Development",
    "budgetRange": "$2k - $5k",
    "message": "I want to build a custom portfolio site."
  }'
```

## 10) List service requests (admin)

```bash
curl http://localhost:5000/api/v1/service-requests?page=1&limit=10 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 11) Get request stats (admin)

```bash
curl http://localhost:5000/api/v1/service-requests/stats \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 12) Update service request status (admin)

```bash
curl -X PATCH http://localhost:5000/api/v1/service-requests/:id/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "status": "in-review"
  }'
```

## 13) Delete service request (admin)

```bash
curl -X DELETE http://localhost:5000/api/v1/service-requests/:id \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
