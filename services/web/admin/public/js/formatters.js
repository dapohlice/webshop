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
    return  currencyConverter(num);
  },
  "status": function (bool) {
    var status = "";

    if (bool) {
      status = "active";
    } else {
      status = "disabled";
    }
    return status;
  },
  "btntogglestatus": function (bool) {
    var status = "";

    if (bool) {
      status = "deactivate";
    } else {
      status = "activate";
    }
    return status;
  },
  "btncolor": function (bool) {
    var btncolor = "";

    if (bool) {
      btncolor = "btn-success";
    } else {
      btncolor = "btn-danger";
    }
    return btncolor;
  },
  "btninvertcolor": function (bool) {
    var btncolor = "";

    if (bool) {
      btncolor = "btn-danger";
    } else {
      btncolor = "btn-success";
    }
    return btncolor;
  },
  "imgpath": function (path) {
    var pathstring;
    console.log("Test");
    console.log(path);
    if (path != null) {
      pathstring = "http://localhost:3004/" + path;
    } else {
      pathstring = "/img/category/shirt.png";
    }

    return pathstring;
  }
};
