quizApp.current.implementation = {
  styles: [ 'css/report.css' ],
  html: [
    '<h1 id="report-title">Report</h1>',
    '<p id="report-text"></p>',
    '<div id="report-pane">',
      '<table class="report">',
        '<thead><tr><th>#</th><th>Exercise</th><th>Tries</th><th>Time</th></tr></thead>',
        '<tbody id="report-table">',
        '</tbody>',
      '</table>',
    '</div>'
  ],
  tpl: '<td class="rightAlign">{index}</td>' +
       '<td>{name}<br /><i>{type}: {url}</i></td>' +
       '<td class="rightAlign">{tries}</td>' +
       '<td class="rightAlign">{time}s</td>',
  init: function(data) {
    this._set("title", data.title);
    this._set("text", data.text);
    var tbody = document.getElementById("report-table");
    var that = this;
    quizApp.reporting.reports.forEach(function(report) {
      var tr = that._createTR(report);
      tbody.appendChild(tr);
    });
  },
  _createTR: function(report) {
    var tr = document.createElement("tr");
    var text = this.tpl;
    var data = this._getDataForReport(report);
    text = text.replace("{index}", report.quizIndex );
    text = text.replace("{name}", this._getNameForReport(report) ) ;
    text = text.replace("{url}", quizApp.quizzes[report.quizIndex]);
    text = text.replace("{type}", data.type);
    text = text.replace("{tries}", report.tries);
    text = text.replace("{time}", Math.ceil(report.time / 1000));
    tr.innerHTML = text;
    return tr;
  },
  _set: function(property, text) {
    if (text) {
      document.getElementById("report-"+property).innerHTML = text;
    }
  },
  _getNameForReport: function(report) {
    var data = this._getDataForReport(report);
    return (data.name) ? data.name :
        (data.title) ? data.title :
         data.type;
  },
  _getDataForReport: function(report) {
    var dataUrl = quizApp.quizzes[report.quizIndex];
    return quizApp.cache.datas[dataUrl];
  }

}