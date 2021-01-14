const SCI: string = 'SCI';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(SCI)
    .addItem('Show sidebar', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('SCI').setTitle('SCI Tools');
  SpreadsheetApp.getUi().showSidebar(html);
}

function downloadAsZip() {
  SpreadsheetApp.getUi().alert('Not implemented yet, sorry');
  // return ContentService.createTextOutput("bbb,aaa,ccc")
  //  .downloadAsFile("MyData.csv")
  //  .setMimeType(ContentService.MimeType.CSV);
}
