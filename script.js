document.addEventListener("DOMContentLoaded", function() {

    // Form
    const blackout_form = document.getElementById("blackout-form");
    const radio_fta = document.getElementById("fta");
    const radio_xag = document.getElementById("xag");
    const input_ccx = document.getElementById("ccx");
    const input_cpu = document.getElementById("cpu");
    const input_sched = document.getElementById("sched");
    const input_job = document.getElementById("job");
    const input_enddate = document.getElementById("end-date");
    const input_comment = document.getElementById("comment");

    // message error
    const message_ccx = document.getElementById("message-ccx");
    const message_cpu = document.getElementById("message-cpu");
    const message_sched = document.getElementById("message-sched");

    // button
    const button_add = document.getElementById("add");
    const button_copy = document.getElementById("copy");
    const button_download = document.getElementById("download");
    const button_reset = document.getElementById("reset");

    // divs
    const container_left = document.getElementById("container-left");
    const container_right = document.getElementById("container-right");
    const div_result = document.getElementById("result");
    const div_enddate = document.getElementById("div-end-date");
    const div_cpu = document.getElementById("div-cpu");
    const div_cpu_type = document.getElementById("div-cpu-type");
    const div_copy = document.getElementById("to-copy");
    const div_copy_success = document.getElementById("copy-success");

    // date et heures
    const today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth()+1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();

    let Ymd = year + month + day;
    let HMS = hour + '' + minute + '' + second;
    
    // disable form not available
    div_enddate.style.display = "none";
    div_cpu.style.display = "none";

    let default_height_container = 700;
    let current_height_container = 700;
    let current_height_result = 550;
    let first_checked = true;

    let folder = '';
    let number_blackout = 1;
    let list_blackout = [];

    if (div_enddate.style.display === "block") {
        current_height_container += 100;
        current_height_result += 100;
        document.getElementById("container-left").style.height = current_height_container + "px";
        document.getElementById("container-right").style.height = current_height_container + "px";
        document.getElementById("result").style.height = current_height_result + "px";
    }

    // action on click when choice FTA or XAG radio
    div_cpu_type.addEventListener("click", function(event) {
        
        display_cpu_and_resize_height();

        if (radio_fta.checked) {
            input_cpu.value = "";
            input_cpu.placeholder = "Enter your FTA name";
        }

        if (radio_xag.checked) {
            if (input_ccx.value !== '' ){
                folder = '/APPLIS/' + input_ccx.value + '/';
                input_cpu.value = folder;
                input_sched.value = folder;
            } else {
                input_cpu.value = '';
            }
            input_cpu.placeholder = "Enter your XAG name (with folder)";
        }
    })

    input_ccx.addEventListener("keyup", function(event) {
        let  ccx_value = input_ccx.value;
        ccx_value = ccx_value.toUpperCase();

        input_ccx.value = ccx_value;

        folder = '/APPLIS/' + input_ccx.value + '/'
        if (radio_xag.checked) {
            input_cpu.value = folder;
        }
        input_sched.value = folder;
    })

    input_ccx.addEventListener("focusout", function(event) {
        const ccx_value = input_ccx.value;
        if (ccx_value.length < 3) {
            input_ccx.classList.add("error");
            message_ccx.classList.add("message-error");
            message_ccx.innerHTML = "Le CCX doit contenir 3 caractères !";
        } else {
            input_ccx.classList.remove("error");
            message_ccx.classList.remove("message-error");
            message_ccx.innerHTML = "";
        }
    })

    input_cpu.addEventListener("keyup", function(event) {
        let  cpu_value = input_cpu.value;
        job_value = cpu_value.toUpperCase();

        input_cpu.value = cpu_value;
    })

    input_job.addEventListener("keyup", function(event) {
        let  job_value = input_job.value;
        job_value = job_value.toUpperCase();

        input_job.value = job_value;
    })

    input_comment.addEventListener("keyup", function(event) {
        let  comment_value = input_comment.value;
        comment_value = comment_value.replaceAll(';', ',');

        input_comment.value = comment_value;
    })

    blackout_form.addEventListener("keyup", function(event) {
        const cpu_value = input_cpu.value;
        input_cpu.value = cpu_value.toUpperCase();

        if (!cpu_value.includes(folder) && radio_xag.checked) {
            input_cpu.classList.add("error");
            message_cpu.classList.add("message-error");
            message_cpu.innerHTML = "Le XAG doit contenir le chemin du folder !";
        } else {
            input_cpu.classList.remove("error");
            message_cpu.classList.remove("message-error");
            message_cpu.innerHTML = "";
        }

        if (radio_fta.checked && (cpu_value.includes("@") || cpu_value.includes("?") || cpu_value.includes("*") || cpu_value.includes(".+") || cpu_value.includes("."))) {
            input_cpu.classList.add("error");
            message_cpu.classList.add("message-error");
            message_cpu.innerHTML = "Les Wildcard sont interdit pour un FTA !";
        }

        const sched_value = input_sched.value;
        input_sched.value = sched_value.toUpperCase();

        if (!sched_value.includes(folder)) {
            input_sched.classList.add("error");
            message_sched.classList.add("message-error");
            message_sched.innerHTML = "Le XAG doit contenir le chemin du folder !";
        } else {
            input_sched.classList.remove("error");
            message_sched.classList.remove("message-error");
            message_sched.innerHTML = "";
        }
    })

    add.addEventListener("click", function(event) {
        event.preventDefault();
        generate_line_blackout();
        list_blackout.push(new_line_blackout);
        div_result.innerHTML += '<div class="data" id="line-' + number_blackout + '"><img src="img/del.png" alt="del" class="line-' + number_blackout + '"><div class="text-line-' + number_blackout + ' text-line" id="text-line-' + number_blackout + '">' + new_line_blackout + '</div></div>';
        number_blackout += 1;
        console.log(list_blackout);
    })

    // Load form with result click
    div_result.addEventListener("click", function(event) {
        let fullid = event.target.classList.value.split(' ')[0];
        const element = document.getElementById(fullid);
        if (!fullid.includes("text") && !fullid.includes("result")) {
            let id_list_blackout = fullid.split('-')[1];
            id_list_blackout -= 1;
            list_blackout[id_list_blackout] = "";
            element.remove();
            return 0;
        }

        if (fullid === "result")
            return 0;
        
        const line_value = element.innerHTML.split(';');
        const iws_value = line_value[0];
        const end_date_value = line_value[1];
        const comment_value = line_value[2];

        const cpu_value = iws_value.split("#")[0];
        const sched_value = iws_value.split("#")[1].split(".")[0];
        const job_value = iws_value.split("#")[1].split(".")[1];
        
        const ccx_value = sched_value.split("/")[2];
        if (cpu_value.includes("/APPLIS/")) {
            radio_xag.checked = true;
        } else {
            radio_fta.checked = true;
        }


        input_ccx.value = ccx_value;
        input_cpu.value = cpu_value;

        display_cpu_and_resize_height();

        input_sched.value = sched_value;
        input_job.value = job_value;
        input_enddate.value = end_date_value;
        input_comment.value = comment_value;
    })

    button_copy.addEventListener("click", function(event) {
        event.preventDefault();

        div_copy.innerHTML = '';

        var filtered = list_blackout.filter(function (el) {
            return el != "";
          });
        
          filtered.forEach((element) => div_copy.innerHTML += element + "<br />");
        // console.log(filtered)

        copyDivToClipboard();
    })

    button_download.addEventListener("click", function(event) {
        event.preventDefault();

        div_copy.innerHTML = '';

        var filtered = list_blackout.filter(function (el) {
            return el != "";
        });
        
        filtered.forEach((element) => div_copy.innerHTML += element + "<br />");

        if (list_blackout.length >= 1){
            var download = document.createElement('a');
            div_copy.style.display = "block";
            console.log(div_copy.innerText);
            download.setAttribute('href',"data:text/plain;charset=utf-8,"+encodeURIComponent(div_copy.innerText));
            download.setAttribute('download',input_ccx.value + '_' + Ymd + '_' + HMS + '.txt');
            div_copy.style.display = "none";
            download.click();
        }
    })

    // Reset form
    button_reset.addEventListener("click", function(event) {
        event.preventDefault();

        radio_xag.checked = false;
        radio_fta.checked = false;
        input_ccx.value = "";
        input_cpu.value = "";
        input_sched.value = "";
        input_job.value = "";
        input_enddate.value = "";
        input_comment.value = "";
        display_cpu_and_resize_height();
        first_checked = true;
    })

    function generate_line_blackout() {
        let cpu_value = input_cpu.value.replaceAll("*", "@").replaceAll(".", "?")
        let sched_value = input_sched.value.replaceAll("*", "@").replaceAll(".", "?")
        let job_value = input_job.value.replaceAll("*", "@").replaceAll(".", "?")
        let date_value = ";";
        let comment_value = ";";
        if (input_enddate.value != "") {
            date_value = date_value + input_enddate.value;
        }
        if (input_comment.value != "") {
            comment_value = date_value + input_comment.value;
        }

        new_line_blackout = cpu_value + '#' + sched_value + '.' + job_value + date_value + comment_value + ';';
    }

    // Hide or Display input cpu and resize containers view
    function display_cpu_and_resize_height() {
        if (radio_fta.checked === false && radio_xag.checked === false) {
            div_cpu.style.display = "none";
            if (container_left.style.height.replace('px','') > default_height_container) {
                current_height_container -= 100;
                current_height_result -= 100;
                container_left.style.height = current_height_container + "px";
                container_right.style.height = current_height_container + "px";
                div_result.style.height = current_height_result + "px";
            }
        }

        if ((radio_fta.checked || radio_xag.checked) && first_checked) {
            div_cpu.style.display = "block";
            current_height_container += 100;
            current_height_result += 100;
            container_left.style.height = current_height_container + "px";
            container_right.style.height = current_height_container + "px";
            div_result.style.height = current_height_result + "px";
            first_checked = false;
        }
    }

    function copyDivToClipboard() {
        
        div_copy.style.display = "block";
        var range = document.createRange();
        range.selectNode(div_copy);
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect
        // document.getElementById("SuccessCopy").innerHTML = "La définition des blackout a été copié dans le presse papier ! ";
        // document.getElementById("SuccessCopy").setAttribute("style", "display:block");
        div_copy.style.display = "none";

        div_copy_success.style.display = "block";
        setTimeout(function(){  div_copy_success.style.display = "none"; }, 3000);
    };

});


