/*
QUESTÃO 1
O trecho de código abaixo mostra uma rota para criar e listar usuários. No entanto, ele está no Nível 1 do modelo de maturidade e precisa ser ajustado para o Nível 2.
 
1. app.post('/users/create', (req, res) => {
 2.     const newUser = { id: users.length + 1, ...req.body };
 3.     users.push(newUser);
 4.     res.status(201).json(newUser);
 5. });
 6.  
 7. app.get('/users/getAll', (req, res) => {
 8.     res.status(200).json(users);
 9. });
10.  

Pergunta:
a) Qual é o problema com o uso das rotas acima?
R - As rostas estão sendo utilizado (/create) e (/getAll), não pertence a RESTful por que não estão no padrão.
b) Explique como o código pode ser ajustado para se adequar ao Nível 2.
R- Remover (/create) e (/getAll) das URL
c) Corrija o código.
R- 
*/
 
app.post('/users', (req, res) => {
     const newUser = { id: users.length + 1, ...req.body };
     users.push(newUser);
    res.status(201).json(newUser);
 });
  
 app.get('/users', (req, res) => {
    res.status(200).json(users);
 });
  




/*
QUESTÃO 2
O código abaixo tenta implementar a exclusão de um usuário específico, mas não atende aos requisitos de uso correto de códigos de status HTTP.
 
 1. app.delete('/users/:id', (req, res) => {
 2.     const id = parseInt(req.params.id);
 3.     const userIndex = users.findIndex(user => user.id === id);
 4.     if (userIndex !== -1) {
 5.         users.splice(userIndex, 1);
 6.         res.json({ message: 'Usuário excluído' });
 7.     } else {
 8.         res.json({ message: 'Usuário não encontrado' });
 9.     }
 10. });
 

Pergunta:
a) Identifique o problema com os códigos de status HTTP usados no código.
R- O padrão é retornar com o erro 404 quando o usuário não é encontrado. Em caso de sucesso, retorna com 200.

b) Corrija o código, adicionando os status HTTP adequados para uma resposta RESTful.

*/

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).json({ message: 'Usuário excluído' });
     } else {
         res.status(404).json({ message: 'Usuário não encontrado' });
     }
 });
    

/*

QUESTÃO 3
Abaixo, há uma rota para atualizar um usuário existente. Porém, o código não diferencia uma atualização parcial de uma atualização completa.
 1. app.put('/users/:id', (req, res) => {
 2.     const id = parseInt(req.params.id);
 3.     const user = users.find(user => user.id === id);
 4.     if (user) {
 5.         user.name = req.body.name;
 6.         res.status(200).json(user);
 7.     } else {
 8.         res.status(404).json({ message: 'Usuário não encontrado' });
 9.     }
10. });
11.  

Pergunta:
a) Explique a diferença entre os métodos PUT e PATCH em uma API REST.
R- Metodo PUT é ultilizado para dados completamente e metodo PACTCH é utilizado par atualizar dados parcialmente. 
b) Corrija o código acima, implementando uma rota PATCH para permitir atualizações parciais.

*/

app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        Object.assign(user, req.body); 
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

/*

QUESTÃO 4
A resposta da API no trecho abaixo não inclui hipermídia (HATEOAS), necessária para atingir o Nível 3 do modelo de maturidade de Richardson.
 
 1. app.get('/users/:id', (req, res) => {
 2.     const id = parseInt(req.params.id);
 3.     const user = users.find(user => user.id === id);
 4.     if (user) {
 5.         res.status(200).json(user);
 6.     } else {
 7.         res.status(404).json({ message: 'Usuário não encontrado' });
 8.     }
 9. });
10.  

Pergunta:
a) Explique o que é HATEOAS e por que ele é importante no modelo REST.
R- Pertence ao modelo REST e tem como objetivo ajudar os clientes consumirem uma API sem necessidade de conhecimento prévio
b) Altere o código para incluir links HATEOAS na resposta da API.

*/

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json({
            ...user,
            links: {
                self: '/users/${id}',
                allUsers: '/users',
                deleteUser: '/users/${id}',
                updateUser: '/users/${id}'
            }
        });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

/*

QUESTÃO 5
Observe o código abaixo, que faz uma busca por um usuário específico. Identifique o problema relacionado à validação e segurança.
 1. app.get('/users/:id', (req, res) => {
 2.     const id = req.params.id;
 3.     const user = users.find(user => user.id === id);
 4.     if (user) {
 5.         res.status(200).json(user);
 6.     } else {
 7.         res.status(404).json({ message: 'Usuário não encontrado' });
 8.     }
 9. });
10.  

Pergunta:
a) Qual é o problema relacionado à validação nesse código?
R- O problema é que o req.params.id está sendo acessado sem uma validação anterior. Caso ele não esteja presente ou não seja um número válido, a operação não deveria ser executada.
b) Corrija o código para incluir a validação adequada.

*/

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' }); 
    }
    
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

/*

QUESTÃO 6
Abaixo temos uma rota que adiciona um novo usuário, mas não faz validação do corpo da requisição.
1. app.post('/users', (req, res) => {
2.     const newUser = { id: users.length + 1, ...req.body };
3.     users.push(newUser);
4.     res.status(201).json(newUser);
5. });
6.  

Pergunta:
a) Qual é o problema de segurança com a falta de validação no corpo da requisição?
R- A falta de validação no corpo da requisição pode permitir dados maliciosos. Caso não seja verificado se o campo name está presente e atende a requisitos 
básicos, usuários podem enviar informações inválidas, resultando em comportamentos indesejados e vulnerabilidades na aplicação.
b) Corrija o código para validar se o campo name está presente e atende a requisitos básicos, como ser uma string com pelo menos 3 caracteres.
*/

app.post('/users', (req, res) => {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ message: 'O campo "name" é obrigatório e deve ter pelo menos 3 caracteres.' });
    }
    
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json(newUser);
});