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
    this._createTD(tr, "" + report.quizIndex);
    this._createTD(tr, this._getNameForReport(report) + "<br /><i>"+ quizApp.quizzes[report.quizIndex] +"</i>" );
    this._createTD(tr, report.tries );
    this._createTD(tr, Math.ceil(report.time / 1000) + " s");
    return tr;
  },
  _createTD: function(tr, value) {
    var td = document.createElement("td");
    tr.appendChild(td);
    td.innerHTML = value;
    return td;
  },
  _set: function(property, text) {
    if (text) {
      document.getElementById("report-"+property).innerHTML = text;
    }
  },
  _getNameForReport: function(report) {
    var dataUrl = quizApp.quizzes[report.quizIndex];
    var data = quizApp.cache.datas[dataUrl];
    return (data.name) ? data.name :
        (data.title) ? data.title :
         data.type;
  }
}