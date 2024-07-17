var aProd = [];
var aCliente = [];

function makeAPICall() {
    atividadeAtual = getWKNumState();
    if(atividadeAtual == 0 || atividadeAtual == 2){
        apagarValores()
        document.getElementById( 'nomeCliente' ).value = '' ;

        var codcliente = document.getElementById('codigoCliente').value
        // console.log(validaCodigo(codcliente))
        if(codcliente.length == 6){
            // Fazendo a chamada para a API
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint("RC_CODCLI", codcliente, codcliente, ConstraintType.MUST));
                
            //Define os campos para ordenação
            var sortingFields = new Array("RC_NOME","RC_CODFIL");
                
            //Busca o dataset
            var data = DatasetFactory.getDataset("dsRetornaCliente2", null, constraints, sortingFields);
            var count = data.values.length;
            console.log(count)
            if (count == 0){
                FLUIGC.message.alert({
                    message: 'O sistema realizou uma busca e não encontrou nenhum lote para este código de cliente.\n Verifique se o código está correto e tente novamente',
                    title: 'Nenhum lote encontrado',
                    label: 'OK'
                },function(el, ev) {
                    
                });
            }else{
                var select = document.getElementById("produtos");
                while (select.options.length > 0) { 
                    select.remove(0);
                }
                while(aProd.length > 0){
                    aProd.pop();
                }
                for (let i = 0; i < count; i++) {
                    var option = new Option(data.values[i].RC_PRODUTO, i.toString())
                    select.add(option);
                    let prodClient = {
                        NomeCliente: data.values[i].RC_NOME,
                        RgCliente: data.values[i].RC_RG,
                        Profissao: data.values[i].RC_PROFISSAO,
                        email: data.values[i].RC_EMAIL,
                        OrgaoExpd: data.values[i].RC_ORGEXP,
                        CpfCliente: data.values[i].RC_CPF,
                        TelCliente: data.values[i].RC_TELEFONE,
                        CelCliente: data.values[i].RC_CELULAR,
                        Cep: data.values[i].RC_CEP,
                        Cidade: data.values[i].RC_CIDADE,
                        Estado: data.values[i].RC_ESTADO,
                        Endereco: data.values[i].RC_ENDERECO,
                        Bairro: data.values[i].RC_BAIRRO,
                        CepCOM: data.values[i].RC_CEPCOM,
                        CidadeCOM: data.values[i].RC_CIDADECOM,
                        EstadoCOM: data.values[i].RC_ESTADOCOM,
                        EnderecoCOM: data.values[i].RC_ENDERECOCOM,
                        BairroCOM: data.values[i].RC_BAIRROCOM,
                        CepCOB: data.values[i].RC_CEPCOB,
                        CidadeCOB: data.values[i].RC_CIDADECOB,
                        EstadoCOB: data.values[i].RC_ESTADOCOB,
                        EnderecoCOB: data.values[i].RC_ENDERECOCOB,
                        BairroCOB: data.values[i].RC_BAIRROCOB,
                        CodFilial: data.values[i].RC_CODFIL,
                        CnpjFilial: data.values[i].RC_CNPJFIL,
                        RazaoFilial: data.values[i].RC_RAZAOFIL,
                        Empreendimento: data.values[i].RC_EMPREENDIMENTO,
                        Lote: data.values[i].RC_LOTE,
                        Quadra: data.values[i].RC_QUADRA,
                        CodProd: data.values[i].RC_CODPROD,
                        CadMun: data.values[i].RC_CADMUN,
                        Pesquisa: codcliente+' - '+data.values[i].RC_NOME+' - '+data.values[i].RC_PRODUTO
                    };                    
                    // Adiciona o objeto do cliente ao array de clientes
                    aProd.push(prodClient);
                }
                if (count > 1) {
                    if(count >= 9){
                        select.setAttribute("size", 9);
                    }else{
                        select.setAttribute("size", count);
                    }
                    document.getElementById('TitModal').innerHTML = 'O cliente '+data.values[0].RC_NOME+' possui '+ count +' lotes, selecione o lote que irá para o registro no cartório'
                    
                    abrirModal()
                    //alert("O cliente possui "+count+" lotes:\n")
                }else{
                    var y = data.values[0].RC_CODPROD
                    VerificaReg(codcliente,0,y)         
                        
                }
            }
        }
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
    atividadeAtual = getWKNumState();
    if(atividadeAtual == 0 || atividadeAtual == 2){
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
            nome = arrayName[0] + "_"
        }else{
            for (let index = 0; index < arrayName.length-1; index++) {
                // console.log(arrayName[index])
                nome += arrayName[index] + "_"
            }
        }
        
        if(arrayName.length>1){
            sobrenome = arrayName[arrayName.length-1]
        }else{
            sobrenome = "_"
        }
        // Codificando o nome de usuário e senha em base64
        

        
        if(nomeCliente.length > 3){
            // Fazendo a chamada para a API
            console.log(nome);
            console.log(sobrenome);
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint("CC_PRINOME", nome, nome, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint("CC_SOBNOME", sobrenome, sobrenome, ConstraintType.MUST));
                
            //Define os campos para ordenação
            var sortingFields = new Array("CC_NOME");
                
            //Busca o dataset
            var data = DatasetFactory.getDataset("dsCliente", null, constraints, sortingFields);
            var count = data.values.length;
            console.log(count)
            if (count == 0){
                FLUIGC.message.alert({
                    message: 'O cliente não foi encontrado. Verifique se o nome está corretamente escrito e tente novamente',
                    title: 'Cliente não encontrado',
                    label: 'OK'
                });
            }else{
                var select = document.getElementById("selcliente");
                console.log(data)
                var n = select.options.length
                while(aCliente.length > 0){
                    aCliente.pop();
                }
                while(select.options.length > 0) {
                    select.options[0].remove();
                }
                console.log(select.options.length)
                if (count > 1) {
                    if(count >= 9){
                        select.setAttribute("size", 9);
                    }else{
                        select.setAttribute("size", count);
                    }
                    document.getElementById('TitModal2').innerHTML = 'Selecione o cliente desejado:'
                    for (let i = 0; i < count; i++) {
                        var option = new Option(data.values[i].CC_CODCLI+' - '+data.values[i].CC_NOME, i.toString())
                        select.add(option);
                        let dadosCliente = {
                            NomeCliente: data.values[i].CC_NOME,
                            CodCliente: data.values[i].CC_CODCLI
                        };
                        
                        // Adiciona o objeto do cliente ao array de clientes
                        aCliente.push(dadosCliente);
                    }
                    abrirModal2()
                    //alert("O cliente possui "+data.ProdutoCliente.length+" lotes:\n")
                }else{
                    document.getElementById('nomeCliente').value = data.values[0].CC_NOME;
                    document.getElementById('codigoCliente').value = data.values[0].CC_CODCLI;
                    makeAPICall()
                }
            }
        }
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

function VerificaReg(codcliente,x,codproduto) {
    var ret;
    var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("VC_CODCLI", codcliente, codcliente, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("VC_CODPRO", codproduto, codproduto, ConstraintType.MUST));
            
        //Busca o dataset
        var data = DatasetFactory.getDataset("dsVerificaCart", null, constraints, null);
        var count = data.values.length;
        console.log(count)
        
        if(data.values[0].VC_VERIFI == 1){
            console.log("O cliente não possui registro no forum");
            FLUIGC.message.alert({
                message: 'O sistema verificou no Protheus e o produto do cliente não possui registro no cartório.\nPor favor acesse o Processo de Registro de Contrato no Cartório para procegrir.',
                title: 'O produto do cliente não possui registro no Cartório',
                label: 'OK'
            },function(el, ev) {
                                   
            });
            apagarValores()
            document.getElementById( 'nomeCliente' ).value = '' ;
            document.getElementById('codigoCliente').value = '' ;
       }else{
            console.log("O produto do cliente possui registro");
            verificaAtivo(x)
       }
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
                        
                        if( dataPC2 != dataPC1){
                            if(i == 1){
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }else{
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }
                            
                            dataPC2 = dataPC1;
                            historic += '<hr>'
                        }else{
                            
                            if(i == 1){
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }else{
                                historic += '<p>'+dataFormatada(data.items[i].date)+' - '+data.items[i].user.name+' movimentou atividade '+data.items[i].targetState.stateName+' para a atividade '+data.items[i].state.stateName+'</p>'
                            }
                            
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

function verificaAtivo(x) {
    var constraints = new Array()
    constraints.push(DatasetFactory.createConstraint("pesquisa", aProd[x].Pesquisa, aProd[x].Pesquisa, ConstraintType.MUST));
            
    //Busca o dataset
    var data = DatasetFactory.getDataset("dsTratativasContratoFinanceiro", null, constraints, null);
    var count = data.values.length;
    console.log('count data: '+count)
    if(count == 0)
        preencheDados(x);
    else{
        var verifica = 0,numSoli,link, soli = [];
        for (let index = 0; index < count; index++) {
            console.log(data)
            numSoli =  data.values[index].numProcess
            console.log('numSoli: '+numSoli)
            var constraints2 = new Array()
            constraints2.push(DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", numSoli, numSoli , ConstraintType.MUST));
            var data2 = DatasetFactory.getDataset("workflowProcess", null, constraints2, null);
            console.log(data2)
            var count2 = data2.values.length;
            console.log('count2 data2: '+count2)
            for (let ct = 0; ct < count2; ct++) {
                if(data2.values[ct].active == 'true' || data2.values[ct].active == true){
                    soli.push(numSoli)
                    verifica = 1;
                }else{
                    verifica = 0;
                }              
            }
        }
        if( verifica == 0){
            preencheDados(x);
        }else{
            link =''
            console.log(soli.length)
            if(soli.length == '1' || soli.length == 1){
                link += 'a <a href="https://thomasie156267.fluig.cloudtotvs.com.br/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+soli[0]+'" target="_blank">Solicitação n°'+soli[0]+'</a>' 
            }else{
                for(let indice = 0; indice < soli.length; indice ++){
                    if(indice == soli.length-1){
                        link += ' e a <a href="https://thomasie156267.fluig.cloudtotvs.com.br/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+soli[indice]+'" target="_blank">Solicitação n°'+soli[indice]+'</a>'
                        
                    }else if(indice == 0){
                        link = 'a <a href="https://thomasie156267.fluig.cloudtotvs.com.br/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+soli[indice]+'" target="_blank">Solicitação n°'+soli[indice]+'</a>' 
                    }else{
                        link += ', a <a href="https://thomasie156267.fluig.cloudtotvs.com.br/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+soli[indice]+'" target="_blank">Solicitação n°'+soli[indice]+'</a>' 
                        console.log(link)
                    }
                };
            }
            FLUIGC.message.confirm({
                title: 'AVISO: Lote já está sendo tratado',
                message: 'O sistema realizou uma busca no dado inserido e encontrou '+link+' ativa. Você deseja prosseguir com a solitação?',
                labelYes: ' Cancelar',
                labelNo: 'Prosseguir'
            }, function(result,el, ev) {
                console.log(result)
                if(result == true || result == 'true'){
                    var tab = window.open(window.location,"_top");
                    tab.close();
                    window.open('https://thomasie156267.fluig.cloudtotvs.com.br');
                }else{
                    preencheDados(x);
                }
            });
            
        }

    }
    
}

function preencheDados(x) {
    document.getElementById('pesquisa').value = aProd[x].Pesquisa;
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
}