function doGet(e){
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  html.setTitle("Peta Kepemilikan Saham").setSandboxMode(HtmlService.SandboxMode.IFRAME);
  return html;
}

function hasilKepemilikanSaham(emiten) {
  var dApp = DriveApp;
  var folderIter = dApp.getFoldersByName("Peta Kepemilikan Saham");
  var folder = folderIter.next();
  var filesIter = folder.getFiles();
  var akses_emiten = "gsx$"+emiten;

  var data = []
  //make column
  data [0] = [emiten, "Kepemilikan Asuransi Lokal","Kepemilikan Perusahaan Lokal", "Kepemilikan Dana Pensiun Lokal", "Kepemilikan Bank Lokal", "Kepemilikan Individu Lokal", "Kepemilikan Perusahaan Reksadana Lokal", "Kepemilikan Perusahaan Efek Lokal", "Kepemilikan Yayasan Lokal", "Kepemilikan Other Lokal", "Kepemilikan Asing"];
  count = 1;

  while(filesIter.hasNext()) {
    var file = filesIter.next();
    //Logger.log(file.getName());
    var spreadsheet = SpreadsheetApp.open(file);
    //Logger.log(spreadsheet.getId());
    var url_json = "https://spreadsheets.google.com/feeds/list/"+spreadsheet.getId()+"/od6/public/values?alt=json";
    var response = UrlFetchApp.fetch(url_json); // get feed
    var dataAll = JSON.parse(response.getContentText());
    //if the data is there
    if(dataAll.feed.entry[9][akses_emiten]){
      var total_lokal = parseInt(dataAll.feed.entry[9][akses_emiten].$t);
      var total_asing = parseInt(dataAll.feed.entry[10][akses_emiten].$t);
      var total_kepemilikan =total_lokal + total_asing;
      var kepemilikan_asuransi_lokal = parseInt(dataAll.feed.entry[0][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_perusahaan_lokal = parseInt(dataAll.feed.entry[1][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_danaPensiun_lokal = parseInt(dataAll.feed.entry[2][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_bank_lokal = parseInt(dataAll.feed.entry[3][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_individu_lokal = parseInt(dataAll.feed.entry[4][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_perusahaanReksadana_lokal = parseInt(dataAll.feed.entry[5][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_perusahaanEfek_lokal = parseInt(dataAll.feed.entry[6][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_yayasan_lokal = parseInt(dataAll.feed.entry[7][akses_emiten].$t) / total_kepemilikan;
      var kepemilikan_other_lokal= parseInt(dataAll.feed.entry[8][akses_emiten].$t) / total_kepemilikan;
      total_asing = total_asing / total_kepemilikan;
      data[count] = [spreadsheet.getSheetName(), kepemilikan_asuransi_lokal, kepemilikan_perusahaan_lokal, kepemilikan_danaPensiun_lokal, kepemilikan_bank_lokal, kepemilikan_individu_lokal, kepemilikan_perusahaanReksadana_lokal, kepemilikan_perusahaanEfek_lokal, kepemilikan_yayasan_lokal, kepemilikan_other_lokal, total_asing];
      count++;
    }
  }
  return data; //return the data with array type
}

  //LOCAL IS = 0
  //LOCAL CP = 1
  //LOCAL PF 2
  //LOCAL IB 3
  //LOCAL ID 4
  //LOCAL MF 5
  //LOCAL SC 6
  //LOCAL FD 7
  //LOCAL OT 8
  //TOTAL LOCAL 9
  //TOTAL FOREIGN 10
