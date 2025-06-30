function obterPlanilhaPeloNome(nome) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  return sheet.getSheetByName(nome);
}

function novaRequisicao() {
  let requisicao = obterPlanilhaPeloNome("NovaRequisicao");

  let descricao = requisicao.getRange(4, 4).getValue(); 
  let emailRequerente = requisicao.getRange(4, 6).getValue(); 
  let localRequisicao = requisicao.getRange(4, 5).getValue(); 
  let statusTexto = "Pendente"; 

  if (!emailRequerente || !descricao || !localRequisicao) {
    SpreadsheetApp.getUi().alert(
      "Por favor, preencha o E-mail do Requerente, a Descrição e o Local antes de enviar."
    );
    return;
  }

  let dataAtual = Utilities.formatDate(
    new Date(),
    SpreadsheetApp.getActiveSpreadsheets().getSpreadsheetTimeZone(), 
    "dd/MM/yyyy HH:mm:ss"
  );

  let requisicaoAberta = obterPlanilhaPeloNome("RequisicoesAbertas");
  let lastRow = requisicaoAberta.getLastRow();
  let novoNumeroDaReq;

  if (lastRow < 2) {
    novoNumeroDaReq = " REQ-0001 ";
  } else {
    let ultimoNumStr = requisicaoAberta.getRange(lastRow, 2).getValue().toString();
    let ultimoNumeroSequencial = 0;

    if (ultimoNumStr.includes("REQ-")) { 
      const partes = ultimoNumStr.split('REQ-');
      if (partes.length > 1) {
          const numStr = partes[1].trim(); 
          ultimoNumeroSequencial = parseInt(numStr);
      }
    }
    if (isNaN(ultimoNumeroSequencial)) { 
        ultimoNumeroSequencial = 0;
    }
    novoNumeroDaReq = " REQ- " + Utilities.formatString("%04d", ultimoNumeroSequencial + 1);
  }

  let rowToInsert = lastRow + 1;
  requisicaoAberta.getRange(rowToInsert, 2, 1, 6).setValues([
    [novoNumeroDaReq, dataAtual, descricao, localRequisicao, emailRequerente, statusTexto],
  ]);

  requisicao.getRange("D4:G4").clearContent();

  let emailErrorMessage = ''; 
  try {
    enviarEmailConfirmacao(
      emailRequerente,
      "helpvoltapp@gmail.com",
      novoNumeroDaReq,
      descricao,
      localRequisicao,
      dataAtual
    );
  } catch (e) {
    if (e.message.includes('Serviço chamado muitas vezes no mesmo dia: email')) {
      emailErrorMessage = " (O e-mail de confirmação não pôde ser enviado devido ao limite diário, mas a solicitação foi registrada.)";
    } else {
      emailErrorMessage = " (Erro ao enviar e-mail de confirmação: " + e.message + ")";
    }
    Logger.log("Erro ao enviar e-mail na novaRequisicao: " + e.message);
  }

  SpreadsheetApp.getUi().alert(
    "Sua requisição foi realizada com sucesso! Número da Requisição: " +
      novoNumeroDaReq + " Esta requisição foi enviada para o e-mail: " + emailRequerente + emailErrorMessage
  );
}


function enviarEmailConfirmacao(emailDestinatario, emailCC, numero, descricao, local, data) {
  let assuntoDescricao = descricao.length > 50 ? descricao.substring(0, 50) + "..." : descricao;
  let assunto = "Requisição Recebida: " + numero + " - " + assuntoDescricao;
  let urlDaImagem = "https://drive.google.com/uc?id=1RmHoXmBhyqgOuOpFcZamSlLZeNepHdQh";

  let htmlCorpo =
    "<p>Prezado(a) Solicitante,</p>" +
    "<p>Confirmamos o recebimento da sua requisição. Ela está sendo processada.</p>" +
    "<p><strong>Detalhes da Requisição:</strong></p>" +
    "<ul>" +
      "<li><strong>Número:</strong> " + numero + "</li>" +
      "<li><strong>Data de Abertura:</strong> " + data + "</li>" +
      "<li><strong>Local:</strong> " + local + "</li>" +
      "<li><strong>Descrição:</strong> " + descricao + "</li>" +
      "<li><strong>Status Inicial:</strong> Pendente</li>" +
    "</ul>" +
    "<p>Você será notificado(a) por e-mail sobre as atualizações de status.</p>" +
    "<p>Atenciosamente,<br>Thiago De Lima</p>" +
    "<p><img src='" + urlDaImagem + "' alt='Logo da HelpVolt' style='width:150px; height:auto;'></p>";

  MailApp.sendEmail({
    to: emailDestinatario,
    cc: emailCC,
    subject: assunto,
    htmlBody: htmlCorpo
  });
}

function enviarEmailAtualizacaoStatus(emailDestinatario, numero, novoStatus, descricao) {
  let assunto = " ATUALIZAÇÃO: Requisição " + numero + " - " + novoStatus;
  let urlDaImagem = "https://drive.google.com/uc?id=1RmHoXmBhyqgOuOpFcZamSlLZeNepHdQh";

  let htmlCorpo =
    "<p>Prezado(a) Solicitante,</p>" +
    "<p>Informamos que o status da sua requisição <strong>" + numero + "</strong> foi atualizado.</p>" +
    "<p><strong>Descrição:</strong> " + descricao + "</p>" +
    "<p><strong>Novo Status:</strong> " + novoStatus + "</p>" +
    "<p>Qualquer dúvida, entre em contato com a administração.</p>" +
    "<p>Atenciosamente,<br>Thiago De Lima.</p>" +
    "<p><img src='" + urlDaImagem + "' alt='Logo da HelpVolt' style='width:150px; height:auto;'></p>";

  try {
    MailApp.sendEmail({
      to: emailDestinatario,
      subject: assunto,
      htmlBody: htmlCorpo
    });
  } catch (e) {
    Logger.log("Erro ao enviar e-mail de atualização de status para requisição " + numero + ": " + e.message);
  }
}

/**
 * Função acionada automaticamente quando uma célula é editada na planilha.
 * Requer um gatilho 'Ao editar' configurado no Apps Script.
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e O objeto de evento.
 */
function onEdit(e) {
  Logger.log("onEdit ativado");
  let ss = e.source;
  let folha = ss.getActiveSheet();
  let celulaEditada = e.range;

  if (folha.getName() === "RequisicoesAbertas" && celulaEditada.getColumn() === 7 && celulaEditada.getRow() > 1) {
    let linhaEditada = celulaEditada.getRow();
    let novoStatus = celulaEditada.getValue();
    let emailRequerenteParaAtualizacao = folha.getRange(linhaEditada, 6).getValue();
    let numeroRequisicao = folha.getRange(linhaEditada, 2).getValue();
    let descricaoRequisicao = folha.getRange(linhaEditada, 4).getValue();

    enviarEmailAtualizacaoStatus(
      emailRequerenteParaAtualizacao,
      numeroRequisicao,
      novoStatus,
      descricaoRequisicao
    );
  }
}


function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Formulário de Requisição');
}


function processarRequisicaoWeb(emailRequerente, localRequisicao, descricao) {
  Logger.log("Requisição recebida do Web App:");
  Logger.log("Email: " + emailRequerente);
  Logger.log("Local: " + localRequisicao);
  Logger.log("Descricao: " + descricao);

  let requisicaoAberta = obterPlanilhaPeloNome("RequisicoesAbertas");

  if (!requisicaoAberta) { 
    Logger.log("Erro: Planilha 'RequisicoesAbertas' (ou 'Configurações') não encontrada.");
    return { success: false, message: 'Erro interno: Verifique a configuração da planilha.' };
  }

  if (!emailRequerente || !descricao || !localRequisicao) {
    return { success: false, message: "Por favor, preencha todos os campos obrigatórios." };
  }

  let lastRow = requisicaoAberta.getLastRow();
  let novoNumeroDaReq;
  if (lastRow < 2) {
    novoNumeroDaReq = " REQ-0001 ";
  } else {
    let ultimoNumStr = requisicaoAberta.getRange(lastRow, 2).getValue().toString();
    let ultimoNumeroSequencial = 0;
    
    if (ultimoNumStr.includes("REQ-")) {
      const partes = ultimoNumStr.split('REQ-');
      if (partes.length > 1) {
          const numStr = partes[1].trim();
          ultimoNumeroSequencial = parseInt(numStr);
      }
    }
    if (isNaN(ultimoNumeroSequencial)) {
        ultimoNumeroSequencial = 0;
    }
    novoNumeroDaReq = " REQ- " + Utilities.formatString("%04d", ultimoNumeroSequencial + 1);
  }

  let dataAtual = Utilities.formatDate(
    new Date(),
    SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
    "dd/MM/yyyy HH:mm:ss"
  );

  let statusTexto = "Pendente"; 

  let rowToInsert = lastRow + 1;
  requisicaoAberta.getRange(rowToInsert, 2, 1, 6).setValues([
    [novoNumeroDaReq, dataAtual, descricao, localRequisicao, emailRequerente, statusTexto],
  ]);

  let emailEnviado = true;
  let emailErrorMessage = '';

  try {
    enviarEmailConfirmacao(
      emailRequerente,
      "helpvoltapp@gmail.com",
      novoNumeroDaReq,
      descricao,
      localRequisicao,
      dataAtual
    );
  } catch (e) {
    emailEnviado = false;
    if (e.message.includes('Serviço chamado muitas vezes no mesmo dia: email')) {
      emailErrorMessage = ' (O e-mail de confirmação não pôde ser enviado devido ao limite diário de e-mails, mas a solicitação foi registrada e será tratada, desculpe a inconveniência. Qualquer dúvida contatar o técnico responsável.)';
    } else {
      emailErrorMessage = ' (Erro ao enviar e-mail de confirmação: ' + e.message + ')';
    }
    Logger.log("Erro ao enviar e-mail para requisição " + novoNumeroDaReq + ": " + e.message);
  }

  return { success: true, message: 'Requisição nº ' + novoNumeroDaReq + ' enviada com sucesso! ' + emailErrorMessage + "A resposta do técnico será enviada para o e-mail: " + emailRequerente + "." };
}

function abrirFormularioWeb() {
  let htmlOutput = HtmlService.createHtmlOutput('<script>window.open("URL_DO_SEU_WEB_APP_AQUI", "_blank");</script>')
    .setHeight(10)
    .setWidth(10);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Abrindo Formulário...');
}