HelpVolt - Sistema de Requisição de Serviços e Automação
Visão Geral do Projeto
O HelpVolt é um sistema de requisição de serviços de manutenção elétrica desenvolvido para otimizar e automatizar o processo de abertura, acompanhamento e comunicação de chamados em um ambiente educacional (Fatec). Criado com foco em eficiência e custos zero, a solução centraliza as solicitações e garante um fluxo de trabalho mais transparente para a equipe de manutenção e para os usuários.

O Problema que o HelpVolt Resolve
Antes do HelpVolt, o processo de solicitação de manutenção era manual, disperso e propenso a falhas de comunicação. Funcionários e alunos tinham dificuldades para reportar problemas de forma clara, e a equipe de manutenção enfrentava desafios na organização e no acompanhamento desses chamados, resultando em possíveis atrasos e falta de feedback.

A Solução HelpVolt
O HelpVolt oferece uma solução completa para esse desafio, combinando um front-end acessível com um backend robusto e automatizado, utilizando o ecossistema Google para manter a gratuidade e a facilidade de uso:

Formulário de Requisição Web: Uma interface web simples e responsiva (HTML/CSS) permite que qualquer usuário acesse o formulário de requisição de serviços, descreva o problema e informe o local. Este formulário pode ser facilmente acessado via QR Code distribuído pelo ambiente.

Registro Automatizado de Chamados: As requisições enviadas pelo formulário são automaticamente registradas e organizadas em uma planilha Google Sheets, que atua como banco de dados. Cada requisição recebe um número único (REQ-XXXX).

Automação de Comunicações:

Confirmação Imediata: Ao abrir uma nova requisição, um e-mail de confirmação é enviado automaticamente tanto para o requerente quanto para o técnico responsável, contendo todos os detalhes do chamado.

Atualizações de Status: Quando o status de uma requisição é alterado na planilha (pelo técnico), o requerente recebe um e-mail de atualização, mantendo-o informado sobre o progresso do serviço (ex: "Pendente", "Em Andamento", "Concluído").

Funcionalidades Principais
Registro de Requisições: Formulário web intuitivo para abertura de chamados.

Notificações por E-mail: Automação de e-mails para confirmação e atualização de status.

Controle de Status: Fácil visualização e atualização do status de cada requisição diretamente na planilha.

Geração de Número de Requisição: Sistema automático para atribuir um ID único a cada novo chamado.

Acesso Via QR Code: Facilita o acesso dos usuários ao formulário em diversos pontos do ambiente físico.

Solução de Custo Zero: Utiliza plataformas gratuitas do Google (Apps Script, Sheets, Drive).

Tecnologias Utilizadas
Google Apps Script (GAS): Linguagem de programação JavaScript baseada na nuvem para toda a lógica de backend, automação e interação com os serviços Google.

Google Sheets: Utilizado como banco de dados para armazenar e gerenciar todas as requisições.

HTML5 & CSS3: Para a construção da interface do usuário (front-end) do formulário web, garantindo um design funcional e responsivo.

Google Drive: Para hospedar e gerenciar recursos, como a imagem do logo utilizada nos e-mails.

Como Usar o Sistema (Para o Usuário Final)
Acesse o Formulário: Escaneie o QR Code disponível no local ou acesse a URL do Web App.

Preencha os Dados: Informe seu e-mail, o local do reparo e uma descrição detalhada da falha técnica.

Envie a Requisição: Clique em "Enviar Requisição". Você receberá um e-mail de confirmação e futuras atualizações sobre o status.

Configuração e Deploy (Para Desenvolvedores)
Este projeto é um Web App do Google Apps Script. Para configurá-lo e implantá-lo:

Copie o Código: Cole o código do Index.html (para o front-end) e o código .gs (para o Google Apps Script) em seu projeto GAS.

Prepare a Planilha: Crie uma nova planilha Google Sheets com o nome "RequisicoesAbertas". As colunas na "RequisicoesAbertas" devem ser configuradas para receber os dados (Número da Requisição, Data de Abertura, Descrição, Local, Email Requerente, Status).

Configurar Gatilhos:

Configure um gatilho onEdit para a função onEdit(e) na planilha "RequisicoesAbertas" para disparar e-mails de atualização de status.

Implantar como Web App: No editor do Google Apps Script, vá em Implantar > Nova implantação. Escolha o tipo Aplicativo da Web, defina quem tem acesso ("Qualquer pessoa, mesmo anônima") e implante. Você receberá uma URL do Web App.

Crie o QR Code: Utilize um gerador de QR Code com a URL do seu Web App para facilitar o acesso.

Contribuição
Contribuições são sempre bem-vindas! Se você tiver ideias para melhorias ou encontrar problemas, sinta-se à vontade para abrir uma issue ou enviar um pull request no repositório.

Autor
Gustavo Calastro

www.linkedin.com/in/gustavo-f-calastro-8750ba56
