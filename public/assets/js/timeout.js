jQuery(document).ready(function($) {
        setInterval(function() {
        var day     =  $(".timeout-day");
        var elapse =  59;
        var elapse_day = 10;
        var day_value = parseInt(day.eq(0).text());
        var hour    =  $(".timeout-hour");
        var hour_value = parseInt(hour.eq(0).text());
        var minute  =  $(".timeout-minute")
        var minute_value = parseInt(minute.eq(0).text());
        var second  =  $(".timeout-second");
        var second_value = parseInt(second.eq(0).text());
        var s , m , h , d;
        //console.log(day_value)
        if(second_value == 0) {
            s =  elapse;
            if(minute_value == 0) {
                m =  elapse;
                if(hour_value == 0) {
                    h = 23;
                    if (day_value == 0) {
                        d = elapse_day;
                        //hideFlashSale();
                    } else {
                        d = day_value - 1;
                    }
                } else {
                    h = hour_value -  1;
                } 
            } else {
                m = minute_value - 1;
            }
        } else {
            s =  second_value  - 1;
        }


        s =  (s < 10 ? "0"+s: s)
        m =  (m < 10 ? "0"+m: m);   
        h =  (h < 10 ? "0"+h: h);
        d =  (d < 10 ? "0"+d: d);
        second.attr('timer',s).text(s);
        minute.attr('timer',m).text(m);
        hour.attr('timer',h).text(h); 
        day.attr('timer',d).text(d);  

     },1000);

});