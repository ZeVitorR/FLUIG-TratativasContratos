var aProd = [];
var aCliente = [];
var username 
var password 


function dados() {
    var usr = 'admin';
    try {
        //Campos que irá trazer
        var fields = new Array("userProtheus","senhaProtheus");
        //Monta as constraints para consulta
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("userProtheus", usr, usr, ConstraintType.MUST));
            
        //Define os campos para ordenação
        var sortingFields = new Array("userProtheus");
            
        //Busca o dataset
        var dataset = DatasetFactory.getDataset("dsSenhaProtheus", fields, constraints, sortingFields);
        var count   = dataset.values.length;
        console.log(count)   
        
        if (count == 0) {
            console.log("Usuário não encontrado!");
        } else {    
            console.log("Cliente encontrado!");
            for (let i = 0; i < count; i++) {
                console.log("O usuário "+dataset.values[i].userProtheus)                
            }
            username = dataset.values[i].userProtheus
            password = dataset.values[i].senhaProtheus
        }
    } catch (e) {
        // TODO: handle exception
        console.log("ERRO: " + e);
        alert("ERRO: " + e);
    }
}

function makeAPICall() {
    apagarValores()
    
    dados()
    var base64Credentials = btoa(username + ':' + password);

    document.getElementById( 'nomeCliente' ).value = '' ;

    var codcliente = document.getElementById('codigoCliente').value
    // console.log(validaCodigo(codcliente))
    // Configurando os detalhes da requisição
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + base64Credentials
        },
    };
    if(codcliente.length == 6){
        // Fazendo a chamada para a API
        fetch('https://boleto.thcm.com.br:9696/rest/WSPROD/PROD?codcliente='+codcliente, requestOptions)
            .then(response => response.json())
            .then(data => {
                var select = document.getElementById("produtos");
                while (select.options.length > 0) { 
                    select.remove(0);
                }
                while(aProd.length > 0){
                    aProd.pop();
                }
                for (let i = 0; i < data.Produto.length; i++) {
                    var option = new Option(data.Produto[i].Produto, i.toString())
                    select.add(option);
                    let prodClient = {
                        NomeCliente: data.Produto[i].NomeCliente,
                        RgCliente: data.Produto[i].RgCliente,
                        Profissao: data.Produto[i].Profissao,
                        email: data.Produto[i].email,
                        OrgaoExpd: data.Produto[i].OrgaoExpd,
                        CpfCliente: data.Produto[i].CpfCliente,
                        TelCliente: data.Produto[i].TelCliente,
                        CelCliente: data.Produto[i].CelCliente,

                        Cep: data.Produto[i].Cep,
                        Cidade: data.Produto[i].Cidade,
                        Estado: data.Produto[i].Estado,
                        Endereco: data.Produto[i].Endereco,
                        Bairro: data.Produto[i].Bairro,

                        CepCOM: data.Produto[i].CepCOM,
                        CidadeCOM: data.Produto[i].CidadeCOM,
                        EstadoCOM: data.Produto[i].EstadoCOM,
                        EnderecoCOM: data.Produto[i].EnderecoCOM,
                        BairroCOM: data.Produto[i].BairroCOM,

                        CepCOB: data.Produto[i].CepCOB,
                        CidadeCOB: data.Produto[i].CidadeCOB,
                        EstadoCOB: data.Produto[i].EstadoCOB,
                        EnderecoCOB: data.Produto[i].EnderecoCOB,
                        BairroCOB: data.Produto[i].BairroCOB,

                        CodFilial: data.Produto[i].CodFilial,
                        CnpjFilial: data.Produto[i].CnpjFilial,
                        RazaoFilial: data.Produto[i].RazaoFilial,
                        Empreendimento: data.Produto[i].Empreendimento,
                        Lote: data.Produto[i].Lote,
                        Quadra: data.Produto[i].Quadra,
                        CodProd: data.Produto[i].CodProd,
                        CadMun: data.Produto[i].CadMun
                    };
                    
                    // Adiciona o objeto do cliente ao array de clientes
                    aProd.push(prodClient);
                }
                if (data.Produto.length > 1) {
                    if(data.Produto.length >= 9){
                        select.setAttribute("size", 9);
                    }else{
                        select.setAttribute("size", data.Produto.length);
                    }
                    document.getElementById('TitModal').innerHTML = 'O cliente '+data.Produto[0].NomeCliente+' possui '+ data.Produto.length +' lotes, selecione o lote que irá para o subjudice'
                    
                    abrirModal()
                    //alert("O cliente possui "+data.Produto.length+" lotes:\n")
                }else{
                    if(data.Produto.length>0){
                        var y = data.Produto[0].CodProd
                        VerificaReg(codcliente,0,y)         
                        
                    }else{
                        FLUIGC.message.alert({
                            message: 'O sistema realizou uma busca e não encontrou nenhum lote para este código de cliente.\n Verifique se o código está correto e tente novamente',
                            title: 'Nenhum lote encontrado',
                            label: 'OK'
                        },function(el, ev) {
                            //Callback action executed by the user...
                             
                            //el: Element (button) clicked...
                            //ev: Event triggered...
                             
                        });
                    }
                    
                }
            })
            .then(data => console.log(data))
            .catch(error => {
                FLUIGC.message.alert({
                    message: 'O sistema realizou uma busca e não encontrou nenhum lote para este código de cliente.\n Verifique se o código está correto e tente novamente',
                    title: 'Nenhum cliente encontrado',
                    label: 'OK'
                },function(el, ev) {
                                       
                });
                console.error('Aconteceu algum erro!', error)
            });
    }
}

function abrirModal(){
    var div = document.getElementById('janela-modal1')
    div.style.display = "flex";
}

function selecionaProduto() {
    var codcliente = document.getElementById('codigoCliente').value;
    var x = parseInt(document.getElementById("produtos").value);
    var y = aProd[x].CodProd;
    VerificaReg(codcliente,x,y);
    var div = document.getElementById('janela-modal1');
    div.style.display = "none";
}

function cancelar() {
    var div = document.getElementById('janela-modal1')
    div.style.display = "none";
}

function makeAPICallCliente() {
    dados()
    var base64Credentials = btoa(username + ':' + password);
    apagarValores()
    document.getElementById('codigoCliente').value = ''

    var nomeCliente = document.getElementById('nomeCliente').value;
    nomeCliente = nomeCliente.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    nomeCliente = nomeCliente.toUpperCase();
    
    var arrayName = nomeCliente.split(" ");
    console.log(arrayName);
    console.log(arrayName.length);
    var nome = "";
    var sobrenome = arrayName[arrayName.length-1]
    if (arrayName.length-1 <= 1) {
        nome = arrayName[0] + " "
    }else{
        for (let index = 0; index < arrayName.length-1; index++) {
            // console.log(arrayName[index])
            nome += arrayName[index] + " "
        }
    }
    
    if(arrayName.length>1){
        sobrenome = arrayName[arrayName.length-1]
    }else{
        sobrenome = " "
    }
    // Codificando o nome de usuário e senha em base64
    

    // Configurando os detalhes da requisição
    var requestOptions2 = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + base64Credentials
        },
    };
    if(nomeCliente.length > 3){
        // Fazendo a chamada para a API
        console.log(nome);
        console.log(sobrenome);
        fetch('https://boleto.thcm.com.br:9696/rest/WSPROD/NOME?prinome='+nome+'&sobrenome='+sobrenome, requestOptions2)
            .then(response => response.json())
            .then(data2 => {
                var select = document.getElementById("selcliente");
                console.log(data2)
                var n = select.options.length
                while(aCliente.length > 0){
                    aCliente.pop();
                }
                while(select.options.length > 0) {
                    select.options[0].remove();
                }
                console.log(select.options.length)
                if (data2.Cliente.length > 1) {
                    if(data2.Cliente.length >= 9){
                        select.setAttribute("size", 9);
                    }else{
                        select.setAttribute("size", data2.Cliente.length);
                    }
                    document.getElementById('TitModal2').innerHTML = 'Selecione o cliente desejado:'
                    for (let i = 0; i < data2.Cliente.length; i++) {
                        var option = new Option(data2.Cliente[i].CodCliente+' - '+data2.Cliente[i].NomeCliente, i.toString())
                        select.add(option);
                        let dadosCliente = {
                            NomeCliente: data2.Cliente[i].NomeCliente,
                            CodCliente: data2.Cliente[i].CodCliente
                        };
                        
                        // Adiciona o objeto do cliente ao array de clientes
                        aCliente.push(dadosCliente);
                    }
                    abrirModal2()
                    //alert("O cliente possui "+data2.Produto.length+" lotes:\n")
                }else{
                    if(data2.Cliente.length > 0){
                        document.getElementById('nomeCliente').value = data2.Cliente[0].NomeCliente;
                        document.getElementById('codigoCliente').value = data2.Cliente[0].CodCliente;
                        makeAPICall()
                    }else{
                        FLUIGC.message.alert({
                            message: 'O cliente não foi encontrado. Verifique se o nome está corretamente escrito e tente novamente',
                            title: 'Cliente não encontrado',
                            label: 'OK'
                        });
                    }
                }
            })
            .then(data2 => console.log(data2))
            .catch(error => console.error('Aconteceu algum erro!', error));
    }
}
function abrirModal2(){
    var div = document.getElementById('janela-modal2')
    div.style.display = "flex";
}

function selecionaCliente() {
    var x = parseInt(document.getElementById("selcliente").value);
    document.getElementById('nomeCliente').value = aCliente[x].NomeCliente;
    document.getElementById('codigoCliente').value = aCliente[x].CodCliente; 
    makeAPICall()
    var div = document.getElementById('janela-modal2')
    div.style.display = "none";
    
}

function cancelar2() {
    var div = document.getElementById('janela-modal2')
    div.style.display = "none";
}

function apagarValores(){
    //Apagando os valores ja colocado
    document.getElementById( 'codigoFilial' ).value = '';
    document.getElementById( 'rgCliente' ).value = '';
    document.getElementById( 'profissaoCliente' ).value = '';
    document.getElementById( 'Email' ).value = '';
    document.getElementById( 'oeRG' ).value = '';
    document.getElementById( 'cpfCliente' ).value = '';
    document.getElementById( 'Tel' ).value = '';
    document.getElementById( 'Cel' ).value = '';
    document.getElementById( 'CEP' ).value = '';
    document.getElementById( 'cidade' ).value = '';
    document.getElementById( 'estado' ).value = '';
    document.getElementById( 'endereco' ).value = '';
    document.getElementById( 'Bairro' ).value = '';
    
    document.getElementById( 'CEPCOM' ).value = '';
    document.getElementById( 'cidadeCOM' ).value = '';
    document.getElementById( 'estadoCOM' ).value = '';
    document.getElementById( 'enderecoCOM' ).value = '';
    document.getElementById( 'BairroCOM' ).value = '';

    document.getElementById( 'CEPCOB' ).value = '';
    document.getElementById( 'cidadeCOB' ).value = '';
    document.getElementById( 'estadoCOB' ).value = '';
    document.getElementById( 'enderecoCOB' ).value = '';
    document.getElementById( 'BairroCOB' ).value = '';

    document.getElementById( 'CNPJ' ).value = '';
    document.getElementById( 'razaoSocial' ).value = '';
    document.getElementById( 'empreendimento' ).value = '';
    document.getElementById( 'lote' ).value = '';
    document.getElementById( 'quadra' ).value = '';
    document.getElementById( 'CadMun' ).value = '';

}

function VerificaReg(codcliente,x,y) {
    var ret;
    dados()
    var base64Credentials = btoa(username + ':' + password);
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + base64Credentials
        },
    };
    fetch('https://boleto.thcm.com.br:9696/rest/WSPROD/VERIFICA?codcliente='+codcliente+'&codproduto='+y, requestOptions)
            .then(response => response.json())
            .then(data => {
               if(data.Cliente[0].Veri == 0){
                    console.log("O produto do cliente possui registro");
                    console.log("O cliente não possui registro no forum");
                    document.getElementById('nomeCliente').value = aProd[x].NomeCliente;
                    document.getElementById('codigoFilial').value = aProd[x].CodFilial;
                    document.getElementById('profissaoCliente').value = aProd[x].Profissao;
                    document.getElementById('Email').value = aProd[x].email;
                    document.getElementById('rgCliente').value = aProd[x].RgCliente;
                    document.getElementById('oeRG').value = aProd[x].OrgaoExpd;
                    document.getElementById('cpfCliente').value = mascara(aProd[x].CpfCliente);
                    document.getElementById('Tel').value = aProd[x].TelCliente;
                    document.getElementById('Cel').value = aProd[x].CelCliente;
                    document.getElementById('CEP').value = aProd[x].Cep;
                    document.getElementById('cidade').value = aProd[x].Cidade;
                    document.getElementById('estado').value = aProd[x].Estado;
                    document.getElementById('endereco').value = aProd[x].Endereco;
                    document.getElementById('Bairro').value = aProd[x].Bairro;
                    
                    document.getElementById( 'CEPCOM' ).value = aProd[x].CepCOM;
                    document.getElementById( 'cidadeCOM' ).value = aProd[x].CidadeCOM;
                    document.getElementById( 'estadoCOM' ).value = aProd[x].EstadoCOM;
                    document.getElementById( 'enderecoCOM' ).value = aProd[x].EnderecoCOM;
                    document.getElementById( 'BairroCOM' ).value = aProd[x].BairroCOM;

                    document.getElementById( 'CEPCOB' ).value = aProd[x].CepCOB;
                    document.getElementById( 'cidadeCOB' ).value = aProd[x].CidadeCOB;
                    document.getElementById( 'estadoCOB' ).value = aProd[x].EstadoCOB;
                    document.getElementById( 'enderecoCOB' ).value = aProd[x].EnderecoCOB;
                    document.getElementById( 'BairroCOB' ).value = aProd[x].BairroCOB;

                    document.getElementById('CNPJ').value = mascara(aProd[x].CnpjFilial);
                    document.getElementById('razaoSocial').value = aProd[x].RazaoFilial;
                    document.getElementById('empreendimento').value = aProd[x].Empreendimento;
                    document.getElementById('lote').value = aProd[x].Lote;
                    document.getElementById('quadra').value = aProd[x].Quadra;
                    document.getElementById('CadMun').value = aProd[x].CadMun;
                    
               }else{
                FLUIGC.message.alert({
                    message: 'O sistema verificou no Protheus e o produto do cliente não possui registro no cartório.\nPor favor acesse o Processo de Registro de Contrato no Cartório para procegrir.',
                    title: 'O produto do cliente não possui registro no Cartório',
                    label: 'OK'
                },function(el, ev) {
                                       
                });
                apagarValores()
                document.getElementById( 'nomeCliente' ).value = '' ;
                document.getElementById('codigoCliente').value = '' ;
               }
               
            })
            .catch(error => {
                console.error('Aconteceu algum erro!', error)
            });
}
dataPC1 = ''
dataPC2 = '' 
function historicoProcesso(idProcesso) {
    var historic = ''
    dataPC1 = ''
    dataPC2 = '' 
    // Configurando os detalhes da requisição
    var requestOptions = {
        method: 'GET',
    };
    
    // Fazendo a chamada para a API
    fetch('https://thomasie156268.fluig.cloudtotvs.com.br:1150/process-management/api/v2/requests/'+idProcesso+'/histories', requestOptions)
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.items.length; i++) {
            if(i == 0){
                dataFormatada(data.items[i].date);
                console.log('i=0 && dataPC1='+dataPC1)
                dataPC2 = dataPC1;
            }
            if(data.items[i].type == 'OBSERVATION'){
                console.log('i='+i+'\ndataPC1='+dataPC1+'\ndataPC2='+dataPC2);
                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' comentou na atividade: '+data.items[i].observationDescription+' </p>'
            }else{
                console.log('i='+i+'\ndataPC1='+dataPC1+'\ndataPC2='+dataPC2);
                if(data.items[i].movementSequence == 1){
                    historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' iniciou a solicitação '+data.items[i].processInstanceId+'</p>'
                }else{
                    if(data.items[i].user.name != 'System:Auto'){
                        
                        if( dataPC2 == dataPC1){
                            if(i == 1){
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }else{
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }
                        }else{
                            historic += '<hr>'
                            if(i == 1){
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }else{
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }
                            dataPC2 = dataPC1;
                        }
                        
                    }
                    
                }
            }
            var element = document.getElementById('hist');
            element.innerHTML = historic        
        }
    })
    .catch(error => {
        FLUIGC.message.alert({
            message: 'Não foi possivel realizar a consulta do historico ->'+error,
            title: 'erro',
            label: 'OK'
        },function(el, ev) {
            //Callback action executed by the user...
            
            //el: Element (button) clicked...
            //ev: Event triggered...
            
            
        });
        console.error('Aconteceu algum erro!', error)
    });
}

function dataFormatada( data ){
    let text = data;
    const myArray = text.split("-", 3);
    const a     = myArray[2].split("T"), 
          day   = a [0], 
          month   = myArray[1],
          year    = myArray[0],
          hour    = a[1].split(".",1)
    dataPC1 = day+'/'+month+'/'+year
    return day+'/'+month+'/'+year+" "+hour
}