Mustache.Formatters = {
  "uppercase": function (str) {
     return str.toUpperCase();
  },
  "lpad": function (str, num, sep) {
     sep = sep || " ";
     str = "" + str;
     var filler = "";
     while ((filler.length + str.length) < num) { filler += sep };
     return (filler + str).slice(-num);
  },
  "date": function (dt) {
     var lpad  = Mustache.Formatters.lpad,
       day   = lpad(dt.getDate(), 2, "0"),
       month = lpad(dt.getMonth()+1, 2, "0");
     return  day + "/" + month + "/" + dt.getFullYear();
  },
  "euro": function (num) {
    var str = num.toString();
    var numarray = str.split('.');
    var a = new Array();
        a = numarray;
    return  a[0] + "," + a[1] + " €";
  }
};
