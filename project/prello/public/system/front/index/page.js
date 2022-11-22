import Plib from "/system/global/pickle.js";

export default class Page {
    constructor() {
        this.plib = new Plib();
        //this.plib.setLoader('body');

        console.log("builded");

        
        this.pageEvents();
        if(localStorage.getItem('token') !== null)this.getItems();
    }

    pageEvents(){
        document.getElementById('login-form').addEventListener('submit',async e=>{
            e.preventDefault();
            const data = new FormData(e.target);
            const formData = Object.fromEntries(data.entries());
            Swal.showLoading();
            await this.plib.transaction('login','login',formData).then(rsp=>{
                if(rsp.success){
                    localStorage.setItem('token',rsp.token);
                    this.getItems();

                    document.getElementById('login-div').hidden = true;
                    document.getElementById('todo-div').hidden = false;

                    Swal.close();
                }else{
                    Swal.fire({
                        icon  : 'error',
                        title : 'Kullanıcı Bulunamadı !!'
                    });
                }
            });
        });

        document.getElementById('btn-add').addEventListener('click',e=>this.itemEvents('add',{
            title : document.getElementById('in-text').value.trim(),
            description : 'Yeni Bir Görev',
        }));
    }

    async itemEvents(type='add',data = {}){
        switch(type){
            case 'add':
                //add to database
                Swal.showLoading();
                await this.plib.transaction('add','items',data).then(rsp=>{
                    if(rsp.success){
                        this.addItem(rsp.data);
                    }
                });
                Swal.close();
                break;
            
        }
    }

    addItem(data){
        const list = document.getElementById('item-list');
        const item = document.createElement('li');
        item.classList.add('list-group-item','d-flex','justify-content-between','align-items-center');
        item.dataset.id = data.id;
        item.appendChild((() => {
            const div = document.createElement('div');
            div.classList.add('ms-2','me-auto');
            div.innerHTML = `<div class="fw-buld">${data.title}</div>
                            ${data.description}`;
            
            return div;
        })());
        item.appendChild((() => {
            const i = document.createElement('i');
            i.classList.add('bi','bi-trash3-fill');
            i.onclick = () => {
                Swal.showLoading();
                this.plib.transaction('delete','items',{id : data.id}).then(rsp=>{
                    item.remove();
                    Swal.close();
                });
            };
            return i;
        })());

        list.appendChild(item);
        document.getElementById('in-text').value = '';
    }

    getItems(){
        this.plib.transaction('get','items',{}).then(rsp=>{
            for (let index = 0; index < rsp.data.length; index++) {
                this.addItem(rsp.data[index]);
            }
        }) 
    }


}