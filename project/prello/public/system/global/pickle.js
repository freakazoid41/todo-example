export default class Plib {
    constructor() {
        //this.CdnUrl = 'http://cache.cilogluarge.com';
    }

    /**
     * system request method
     * @param {json object} rqs
     */
    async request(rqs, file = null, isApi = true) {
        //set fetch options
        const op = {
            headers : {
                'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').content,
                ...(localStorage.getItem('token') !== null ? {
                    'Authorization' : 'Bearer '+ localStorage.getItem('token')
                }: {})
            },
            method: rqs["method"],
        };

        switch (op.method) {
            case "put":
            case "delete":
                //because patch and delete methods will send url encoded data !!
                op.headers = {
                    ...op.headers,
                    ...{"Content-Type": "application/x-www-form-urlencoded"},
                };
                op.body = new URLSearchParams(rqs.data);
                break;
            case "post":
                //create form data
                const fD = new FormData();
                for (let key in rqs.data) {
                    fD.append(key, rqs.data[key]);
                }
                if (file !== null && file !== undefined) {
                    fD.append("file", file, file.name);
                }
                op.body = fD;
                break;
            default:
                break;
        }

        //send fetch
        const rsp = await fetch(rqs.url, op).then((response) => {
            //convert to json
            return response.json();
        });
        //in this point check if api is send timeout command
        /*if (rsp.command !== undefined) {
                switch (parseInt(rsp.command)) {
                    case 0:
                        //this mean token is not valid
                        this._logout();
                        break;
                }
            }*/
        return rsp;
    }

    /**
     * Clear all items
     * @param {string} selector
     */
    clearElements(selector) {
        let elms = document.querySelectorAll(selector);
        for (let i = 0; i < elms.length; i++) {
            switch (elms[i].tagName) {
                case "SELECT":
                    elms[i].selectedIndex = 0;
                    break;
                case "LABEL":
                    elms[i].innerHTML = "";
                    break;
                case "INPUT":
                    if (elms[i].getAttribute("type") === "radio" || elms[i].getAttribute("type") === "checkbox") {
                        elms[i].checked = false;
                    } else {
                        elms[i].value = "";
                        if (elms[i].name.includes('_key')) elms[i].value = "-";
                    }
                    break;
                default:
                    elms[i].value = "";
                    break;
                case 'DIV':
                    if (elms[i].classList.contains('text-editor')) {
                        const editor = elms[i].querySelector('.ql-editor');
                        if (editor !== null) {
                            editor.innerHTML = '';
                            delete elms[i].value;
                        }
                    }
                    break;
            }
            elms[i].classList.remove("is-invalid");
        }
        //set invisible language inputs
        elms = document.querySelectorAll(".div_lang_row");
        for (let i = 0; i < elms.length; i++) {
            elms[i].style.display = "none";
        }
    }

    /**
     * Get form element with validation
     * @param {string} selector
     */
    checkForm(selector) {
        const rsp = {
            obj: {},
            s_file: null,
            valid: true,
        };
        //get elements
        const elms = document.querySelectorAll(selector);
        for (let i = 0; i < elms.length; i++) {
            //for editor
            if (elms[i].classList.contains('text-editor')) {
                elms[i].value = tinymce.get(elms[i].id).getContent();
                elms[i].name = elms[i].dataset.name.trim();
                elms[i].required = elms[i].dataset.required;
            }

            if (elms[i].value === undefined) elms[i].value = '-';

            if (elms[i].value && elms[i].value.trim() !== "") {
                if (elms[i].type == "file") {
                    rsp.s_file = elms[i].files[0];
                } else {
                    if (elms[i].name !== undefined && elms[i].name !== null && elms[i].name.trim() !== "") {
                        //for language
                        if (elms[i].dataset.lang !== undefined) {
                            if (rsp.obj[elms[i].name] === undefined) {
                                rsp.obj[elms[i].name] = {};
                            } else {
                                rsp.obj[elms[i].name] = JSON.parse(rsp.obj[elms[i].name]);
                            }

                            rsp.obj[elms[i].name][elms[i].dataset.lang] = elms[i].value.trim();

                            rsp.obj[elms[i].name] = JSON.stringify(rsp.obj[elms[i].name]);
                        } else {
                            rsp.obj[elms[i].name] = elms[i].value;
                        }
                        //for checkbox
                        if (elms[i].type === "checkbox") {
                            if (elms[i].dataset.active !== undefined) {
                                rsp.obj[elms[i].name] = elms[i].checked ? elms[i].dataset.active : elms[i].dataset.passive;
                            } else {
                                rsp.obj[elms[i].name] = Number(elms[i].checked);
                            }
                        }
                    }
                }
                elms[i].classList.remove("is-invalid");
            } else {
                console.log(elms[i]);
                if (elms[i].required && !elms[i].disabled) {

                    elms[i].classList.add("is-invalid");
                    rsp.valid = false;
                } else {
                    elms[i].classList.remove("is-invalid");
                }
            }
        }
        return rsp;
    }

    /**
     * this method will format money decimal
     * @param {float} amount
     * @param {int} decimalCount
     * @param {string} decimal
     * @param {string} thousands
     */
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            const i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
            const j = i.length > 3 ? i.length % 3 : 0;

            return (
                negativeSign +
                (j ? i.substr(0, j) + thousands : "") +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
                (decimalCount ?
                    decimal +
                    Math.abs(amount - i)
                    .toFixed(decimalCount)
                    .slice(2) :
                    "")
            );
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Toast message (sweet alert 2)
     * @param {string} type
     * @param {string} msg
     */
    toast(type, msg) {
        Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        }).fire({
            icon: type,
            title: msg,
            heightAuto: true,
        });
    }

    seoTitle(title) {
        title = title.toLowerCase();
        title = title.replace(/ /g, "-");
        title = title.replace(/\./g, "-");
        title = title.replace(/ü/g, "u");
        title = title.replace(/ı/g, "i");
        title = title.replace(/ç/g, "c");
        title = title.replace(/ş/g, "s");
        title = title.replace(/ğ/g, "g");
        title = title.replace(/ö/g, "o");
        title = title.replace(/\)/g, "");
        title = title.replace(/\(/g, "");
        return title + (new Date()).getTime();
    }

    compressImage(file, success, ratio) {
        const f = file;
        const fileName = f.name.split('.')[0];
        const img = new Image();
        img.src = URL.createObjectURL(f);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const f2 = new File([blob], fileName + ".jpeg");
                success(f2);
            }, 'image/jpeg', ratio);
        }
    }

    /**
     * Alert message (sweet alert 2)
     * @param {string} type
     * @param {string} msg
     */
    promt(type, msg) {
        Swal.fire({
            type: type,
            text: msg,
            showConfirmButton: false,
        });
    }

    // sleep like method
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    //get languge value
    getLang = (value) =>  document.querySelector('.lang-value[data-key="'+value+'"]').value.trim();
    
    /**
     * this method will get file from url and convert to file object
     */
    async createFile(url,name){
        const type = url.split(/[#?]/)[0].split('.').pop().trim();
        const response = await fetch(url);
        const data = await response.blob();
        /* let metadata = {
          type: 'image/jpeg'
        };*/
        return new File([data], "copy-"+name /*, metadata*/);
        // ... do something with the file or return it
    }

    /**
     * this method will send transaction request
     * @param {string} type 
     * @param {string} model 
     * @param {object} data 
     * @returns {object} 'rsp' from api
     */
    async transaction(type = 'get',model,data = {}){
        const trans = {
            'login'  : {
                req : 'post',
                url : 'auth'
            },
            'get'    : {
                req : 'get',
                url : 'request'
            },
            'ask'    : {
                req : 'post',
                url : 'query'
            },
            'add'    : {
                req : 'post',
                url : 'request'
            },
            'update' : {
                req : 'put',
                url : 'request'
            },
            'delete' : {
                req : 'delete',
                url : 'request'
            }
        };

        return this.request({
            method: trans[type].req,
            url: "/api/"+trans[type].url+'/'+model+(data.id ? '/'+data.id : ''),
            data: data,
        });
    }

    /**
     * this function will open new tab with poste parmeters
     * exp. openTab('POST', 'http://biber.picklecan.loc/spec/', {"Tedarik":"1523546", "Region":"TR"},'_blank');
     * @param {strng} verb
     * @param {string} url
     * @param {json} data
     * @param {string} target
     */
    async openTab(verb, url, data, target) {
        let form = document.createElement("form");
        form.action = url;
        form.method = verb;
        form.target = target || "_self";
        if (data) {
            for (var key in data) {
                var input = document.createElement("textarea");
                input.name = key;
                input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                form.appendChild(input);
            }
        }
        form.style.display = "none";
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    /**
     * this method will set loading to div
     * @param {string} selector
     * @param {boolean} event
     */
    setLoader(selector, event = true) {
        let elms = document.querySelectorAll(selector);
        if (event) {
            document.body.style.pointerEvents = "none";
            for (let i = 0; i < elms.length; i++) {
                elms[i].classList.add("b-loader");
            }
        } else {
            document.body.style.pointerEvents = "";
            for (let i = 0; i < elms.length; i++) {
                elms[i].classList.remove("b-loader");
            }
        }
    }

    /**
     * Get parameter from url
     */
    getUrlParam(param) {
        return new URL(window.location.href).searchParams.get(param);
    }

    getNumberOfDays(start, end) {
        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = end.getTime() - start.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        return diffInDays;
    }
}
