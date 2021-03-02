export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('SCI')
    .addItem('Packer', 'openPackerDialog');

  menu.addToUi();
};

export const openPackerDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-packer')
    .setWidth(600)
    .setHeight(250);

  SpreadsheetApp.getUi().showModalDialog(html, 'SCI Packer');
};
