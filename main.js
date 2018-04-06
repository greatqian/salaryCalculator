$(document).ready(function() {

   console.log(isNaN("1321s"));
   console.log(isNaN("    "));

   initView();

   addInputListener();

   $("#calculate").click(function() {

      if (!$("#calculate").hasClass("ready")) {
         return;
      }

      var city = $("#city").val();
      var salary = $("#salary").val();

      salary = parseInt(salary);

      if (!checkSalary(salary)) {
         return;
      }
      
      $("#resultContainer").hide();
      $("#loading").show();
      setTimeout(function() {
         $("#loading").hide();
         $("#resultContainer").show();
         calculate(city, salary);
      }, 2000);

   })


   function initView() {
      $("#resultContainer").hide();
      $("#loading").hide();

      for (var i in data.insurance) {
         var option = $("<option>" + i + "</option>");
         $("#city").append(option);
      }
   }

   function addInputListener() {
      $("#salary").on('input', function() {
         var text = $("#salary").val();
         if (isNaN(text) || text.trim() === "") {
            $("#calculate").removeClass("ready");
         } else {
            $("#calculate").addClass("ready");
         }
      })
   }

   function checkSalary(salary) {
      if (salary > 100000000) {
         alert("太大了...");
      }
      if (salary < 500) {
         alert("工资怎么可能这么少...");
      }
      if (salary >= 500 && salary <= 100000000) {
         return true;
      }
      return false;
   }


   function calculate(city, salary) {

      var addition = data.insurance[city].addition;//医疗保险附加
      var gongShang0 = data.insurance[city].gongShang0;//个人工伤保险
      var gongShang1 = data.insurance[city].gongShang1;//企业工商保险
      var jiJinLower = data.insurance[city].jiJinLower;//公积金基数下限
      var jiJinUpper = data.insurance[city].jiJinUpper;//公积金基数上限
      var sheBaoLower = data.insurance[city].sheBaoLower;//社保基数下限
      var sheBaoUpper = data.insurance[city].sheBaoUpper;//社保基数上限
      var shengYu0 = data.insurance[city].shengYu0;//个人生育保险
      var shengYu1 = data.insurance[city].shengYu1;//企业生育保险
      var shiYe0 = data.insurance[city].shiYe0;//个人失业保险
      var shiYe1 = data.insurance[city].shiYe1;//企业失业保险
      var yangLao0 = data.insurance[city].yangLao0;//个人养老保险
      var yangLao1 = data.insurance[city].yangLao1;//企业养老保险
      var yiLiao0 = data.insurance[city].yiLiao0;//个人医疗保险
      var yiLiao1 = data.insurance[city].yiLiao1;//企业医疗保险
      var zhuFang0 = data.insurance[city].zhuFang0;//个人住房保险
      var zhuFang1 = data.insurance[city].zhuFang1;//企业住房保险
      
      var sheBaoBase = salary;
      if (salary < sheBaoLower) {
         salaryBase = sheBaoLower;
      }
      if (salary > sheBaoUpper) {
         salaryBase = sheBaoUpper;
      }
      var jiJinBase = salary;
      if (salary < jiJinLower) {
         jiJinBase = jiJinLower;
      }
      if (salary > jiJinUpper) {
         jiJinBase = jiJinUpper;
      }

      var yangLaoCount0 = sheBaoBase * yangLao0;
      var yiLiaoCount0 = sheBaoBase * yiLiao0;
      var shiYeCount0 = sheBaoBase * shiYe0;
      var gongShangCount0 = sheBaoBase * gongShang0;
      var shenYuCount0 = sheBaoBase * shengYu0;
      var jiJinCount0 = jiJinBase * zhuFang0;

      var yangLaoCount1 = sheBaoBase * yangLao1;
      var yiLiaoCount1 = sheBaoBase * yiLiao1;
      var shiYeCount1 = sheBaoBase * shiYe1;
      var gongShangCount1 = sheBaoBase * gongShang1;
      var shenYuCount1 = sheBaoBase * shengYu1;
      var jiJinCount1 = jiJinBase * zhuFang1;

      var personalTaxCount;
      var personalTaxPart = salary - 3500;
      if (salary <= 3500) {
         personalTaxCount = 0;
         personalTaxPart = 0;
      }
      if (personalTaxPart <= 1500) {
         personalTaxCount = personalTaxPart * 0.03;
      } else if (personalTaxPart < 4500) {
         personalTaxCount = (personalTaxPart - 1500) * 0.1 + 105;
      } else if (personalTaxPart < 9000) {
         personalTaxCount = (personalTaxPart - 4500) * 0.2 + 505;
      } else if (personalTaxPart < 35000) {
         personalTaxCount = (personalTaxPart - 9000) * 0.25 + 1005;
      } else if (personalTaxPart < 55000) {
         personalTaxCount = (personalTaxPart - 35000) * 0.3 + 2755;
      } else if (personalTaxPart < 80000) {
         personalTaxCount = (personalTaxPart - 55000) * 0.35 + 5505;
      } else {
         personalTaxCount = (personalTaxPart - 80000) * 0.45 + 13505;
      }

      var totalCount0 = yangLaoCount0 + yiLiaoCount0 + shiYeCount0 + gongShangCount0 + shenYuCount0 + jiJinCount0 + personalTaxCount;
      var totalCount1 = yangLaoCount1 + yiLiaoCount1 + shiYeCount1 + gongShangCount1 + shenYuCount1 + jiJinCount1;

      var taxedSalary = salary - yangLaoCount0 - yiLiaoCount0 - shiYeCount0 - gongShangCount0 - shenYuCount0 - jiJinCount0 - personalTaxCount;
      taxedSalary = taxedSalary.toFixed(2);

      showTaxedSalary(taxedSalary);

      var resultData = {
         salary: salary,
         taxedSalary: taxedSalary,
         rate: {
            addition: addition,
            gongShang0: gongShang0,
            gongShang1: gongShang1,
            jiJinLower: jiJinLower,
            jiJinUpper: jiJinUpper,
            sheBaoLower: sheBaoLower,
            sheBaoUpper: sheBaoUpper,
            shengYu0: shengYu0,
            shengYu1: shengYu1,
            shiYe0: shiYe0,
            shiYe1: shiYe1,
            yangLao0: yangLao0,
            yangLao1: yangLao1,
            yiLiao0: yiLiao0,
            yiLiao1: yiLiao1,
            zhuFang0: zhuFang0,
            zhuFang1: zhuFang1,
         },
         count: {
            yangLaoCount0: yangLaoCount0,
            yiLiaoCount0: yiLiaoCount0,
            shiYeCount0: shiYeCount0,
            gongShangCount0: gongShangCount0,
            shenYuCount0: shenYuCount0,
            jiJinCount0: jiJinCount0,
            yangLaoCount1: yangLaoCount1,
            yiLiaoCount1: yiLiaoCount1,
            shiYeCount1: shiYeCount1, 
            gongShangCount1: gongShangCount1,
            shenYuCount1: shenYuCount1,
            jiJinCount1: jiJinCount1,
            personalTaxCount: personalTaxCount,
            totalCount0: totalCount0,
            totalCount1: totalCount1
         }
      };

      for (var i in resultData) {
         if (i == "count") {
            for (var j in resultData["count"]) {
               resultData["count"][j] = Math.round(resultData["count"][j] * 100) / 100;
            }
         } else if (i === "rate") {

         } else {
            resultData[i] = Math.round(resultData[i] * 100) / 100;
         }
      }

      console.log(resultData);

      updateTableData(resultData);
      updateCharts(resultData);

   }

   function showTaxedSalary(taxedSalary) {
      $("#taxedSalary").text(taxedSalary);
   }

   function updateTableData(resultData) {
      for (var i in resultData["count"]) {
         $("#" + i).text(resultData["count"][i].toFixed(2) + "元");
      }
   }

   function updateCharts(resultData) {

      var personalTaxCount = resultData["count"]["personalTaxCount"];
      var fiveInsuranceCount = Math.round((resultData["count"]["totalCount0"] - personalTaxCount) * 100) / 100;
      var taxedSalary = resultData["taxedSalary"];
      var data1 = [
                     ['五险一金', fiveInsuranceCount],
                     ['个人所得税', personalTaxCount],
                     ['税后工资', taxedSalary * 1.0]
                  ];

      var data2 = [
                     ['养老保险', resultData["count"]["yangLaoCount0"]],
                     ['医疗保险', resultData["count"]["yiLiaoCount0"]],
                     {
                        name: '生育保险',
                        y: resultData["count"]["shenYuCount0"],
                        sliced: true,
                        selected: true
                     },
                     ['失业保险', resultData["count"]["shiYeCount0"]],
                     ['工伤保险', resultData["count"]["shiYeCount0"]],
                     ['住房公积金', resultData["count"]["jiJinCount0"]],
                     ['个人所得税', resultData["count"]["personalTaxCount"]]
                  ];

      var data3 = [
                     ['养老保险', resultData["count"]["yangLaoCount1"]],
                     ['医疗保险', resultData["count"]["yiLiaoCount1"]],
                     {
                        name: '生育保险',
                        y: resultData["count"]["shenYuCount1"],
                        sliced: true,
                        selected: true
                     },
                     ['失业保险', resultData["count"]["shiYeCount1"]],
                     ['工伤保险', resultData["count"]["shiYeCount1"]],
                     ['住房公积金', resultData["count"]["jiJinCount1"]],
                     ['税前工资', resultData["salary"]]
                  ];

      plotCharts(data1, data2, data3);

   }

   function plotCharts(data1, data2, data3) {

      var chart = {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false
      };

      var title1 = {
         text: '我的工资'   
      };
      var title2 = {
         text: '五险一金详情'   
      };
      var title3 = {
         text: '单位支出'
      };


      var tooltip = {
         pointFormat: '{point.percentage:.1f}%:  <b>{point.y}</b>元'
      };

      var plotOptions = {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name} </b>{point.percentage:.1f}%',
               style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
               }
            }
         }
      };
      var series1 = [{
         type: 'pie',
         name: 'Browser share',
         data: data1
      }];

      var series2 = [{
         type: 'pie',
         name: 'Browser share',
         data: data2
      }];

      var series3 = [{
         type: 'pie',
         name: 'Browser share',
         data: data3
      }];
         
      var json1 = {};   
      json1.chart = chart; 
      json1.title = title1;     
      json1.tooltip = tooltip;  
      json1.series = series1;
      json1.plotOptions = plotOptions;

      var json2 = {};   
      json2.chart = chart; 
      json2.title = title2;     
      json2.tooltip = tooltip;  
      json2.series = series2;
      json2.plotOptions = plotOptions;

      var json3 = {};   
      json3.chart = chart; 
      json3.title = title3;     
      json3.tooltip = tooltip;  
      json3.series = series3;
      json3.plotOptions = plotOptions;



      $('#chart1').highcharts(json1);
      $('#chart2').highcharts(json2);
      $('#chart3').highcharts(json3);


   }


});