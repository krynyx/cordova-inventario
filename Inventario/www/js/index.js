/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
var CODIGO_SECAO = 0;
var CODIGO_PRODUTO = 1;
var QUANTIDADE = 2;
var TIPO_QUANTIDADE = 3;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

	$(document).ready(function() {
		$('#pageContent').load('adicionar.html', bindEventosPaginaAdicionar);
		
		//faz bind dos eventos
		$(document).on('click', '#btnSobre', function () {
			$('#pageContent').load('sobre.html');
		});
		$(document).on('click', '#btnAdicionar', adicionarProduto);
		$(document).on('change', '#optOrdenarProdutos', function () {
			var ordem = $(this).val();
			listarProdutos(ordem);
		});
		$(document).on('click', '.btnRemoverProduto', removerProduto);
		$(document).on('click', '#btnLimparDados', limparLocalStorage);
		$(document).on('click', '#btnBuscarProduto', buscarProduto);
		
		$('.btnLoadPage').click(function() {
			var page = $(this).attr('data-page');
			//muda a cor do link da aba ativa
			$('.btnLoadPage').parent().removeClass('page-active');
			$(this).parent().addClass('page-active');
			
			if (page == 'adicionar') {
				$('#pageContent').load('adicionar.html', function () {
					$('#secao').focus();
				});
			} else if (page == 'listar') {
				$('#pageContent').load('listar.html', function () {
					listarProdutos(1);
				});
			} else if (page == 'buscar') {
				$('#pageContent').load('buscar.html', function () {
					$('#produto').focus();
					$(document).on('keypress', '#produto', function (e) {
						if (e.which == 13) {buscarProduto();}
					});
				});
			}
			
		});
	});
}

function bindEventosPaginaAdicionar(){
	$('#secao').focus();
	//vai mudando o foco entre os campos de acordo com o enter
	$(document).on('keypress', '#secao', function (e) {
		if (e.which == 13) {$('#produto').focus();}
	});
	$(document).on('keypress', '#produto', function (e) {
		if (e.which == 13) {$('#quantidade').focus();}
	});	
	$(document).on('keypress', '#quantidade', function (e) {
		if (e.which == 13) {adicionarProduto()};
	});	
}

function adicionarProduto() {
	var codSecao = $('#secao').val();
	var codProduto = $('#produto').val();
	var quantidade = $('#quantidade').val();
	var tipoQuantidade = $('#tipoQuantidade').val();
	
	//Obtém a lista de produtos salvos caso exista
	var dbProdutos = window.localStorage.getItem("produtos");
	
	/* Se existir um objeto JSON de produtos, então adicionar o
	 * novo produto a lista existente, senão criar o objeto de produtos. */
	if (dbProdutos) {
		//já existe uma lista de produtos, então adicionar o novo produto
		var produto = [codSecao, codProduto, quantidade, tipoQuantidade];
		var produtos = $.parseJSON(dbProdutos);
		produtos.push(produto);
		window.localStorage.setItem("produtos", JSON.stringify(produtos));
	} else {
		//não existe uma lista de produtos, então criar agora
		var produtos = [[codSecao, codProduto, quantidade, tipoQuantidade]];
		window.localStorage.setItem("produtos", JSON.stringify(produtos));
	}
	
	//remove a primeira linha da tabela
	$('#infoProduto').remove();
	
	var linha = '<tr>' +
				'<td class="text-left">IN'+codSecao+'</td>' +
				'<td class="text-center">'+codProduto+'</td>' +
				'<td class="text-right">'+quantidade+' '+tipoQuantidade+'</td>' +
				'</tr>';
	$('#tabelaDeProdutos tbody').append(linha);
	//limp o campo de quantidade
	$('#quantidade').val('');
	$('#produto').focus();
}

function listarProdutos(ordem) {
	var dbProdutos = window.localStorage.getItem("produtos");
	
	//Se não tiver produtos salvos, então não fazer nada
	if (!dbProdutos) {
		$('#tabelaDeProdutos tbody').html('<tr><td colspan="4" class="text-center">NENHUM PRODUTO ENCONTRADO.</td></tr>');
		return;
	}
	
	//Tem produtos salvos, então listar na página
	var produtos = $.parseJSON(dbProdutos);
	var totalProdutos = produtos.length;
	
	/* Ordena os produtos de acordo com a opção desejada pelo usuário.
	 * Os dados são ordenados pela key do array produtos */	
	if (ordem != 'none') {
		//se for pela ordem de inserção então não fazer nada
		produtos.sort(function(a,b){return a[ordem] - b[ordem]});
	}
	
	$('#tabelaDeProdutos tbody').html('');
	for (var x = 0; x < totalProdutos; x++) {
		var secao = produtos[x][0];
		var produto = produtos[x][1];
		var quantidade = produtos[x][2];
		var tipoQuantidade = produtos[x][3];
		var reference = ordem+':'+x;
		
		var linha = '<tr>' +
					'<td class="text-left">IN'+secao+'</td>' +
					'<td class="text-left">'+produto+'</td>' +
					'<td class="text-right">'+quantidade+' '+tipoQuantidade+'</td>' +
					'<td class="text-right"><a href="#" class="btnRemoverProduto" data-id="'+reference+'" title="remover produto"><i class="bi bi-trash-fill"></a></td>' +
					'</tr>';
		$('#tabelaDeProdutos tbody').append(linha);
	}

}

function removerProduto() {
	var data = $(this).attr('data-id').split(':');
	var ordem = data[0];
	var idProduto = data[1];
	
	var dbProdutos = window.localStorage.getItem("produtos");
	var produtos = $.parseJSON(dbProdutos);
	
	if (ordem != 'none') {
		//se for pela ordem de inserção então não fazer nada
		produtos.sort(function(a,b){return a[ordem] - b[ordem]});
	}

	var produto = produtos[idProduto];
	var confirma = confirm("Deseja mesmo remover o produto "+produto[CODIGO_PRODUTO]+" da seção IN"+produto[CODIGO_SECAO]+"?");
	if (confirma) {
		produtos.splice(idProduto, 1); //remove do array
		//salva o array atualizado
		window.localStorage.setItem("produtos", JSON.stringify(produtos));
		//remove o elemento da tabela
		$(this).parent().parent().remove();
	}
}

//Remove todos os dados do banco de dados
function limparLocalStorage() {
	var primeiraTentativa = confirm("Deseja mesmo remover todos os produtos do inventário?");
	
	if (primeiraTentativa) {
		var segundTentativa = confirm("Tem certeza? Você perderá todos os dados salvos até agora!");
		if (segundTentativa) {
			window.localStorage.clear();
			listarProdutos('none');
		}
	}
}

function buscarProduto() {
	$('#resultadoDaBusca').text('');
	var codProduto = $('#produto').val();
	var dbProdutos = window.localStorage.getItem("produtos");
	var countProdutos = 0;
	//Se não tem produto salvo então não faz busca
	if (!dbProdutos) {
		$('#resultadoDaBusca').text('NENHUM PRODUTO SALVO!');
		return;
	}
	
	var produtos = $.parseJSON(dbProdutos);
	var somaProdutos = {und: 0, cxa: 0, pct: 0, kg: 0, gr: 0};
	
	$('#tabelaDeProdutos tbody').html('');
	for (x = 0; x < produtos.length; x++) {
		var produto = produtos[x];
		
		if (produto[CODIGO_PRODUTO] == codProduto) {
			var secao = produto[CODIGO_SECAO];
			var codProduto = produto[CODIGO_PRODUTO];
			var quantidade = produto[QUANTIDADE];
			var tipoQuantidade = produto[TIPO_QUANTIDADE];
			var reference = 'none:'+x;
			somaProdutos[tipoQuantidade] += parseInt(quantidade);
			
			var linha = '<tr>' +
						'<td class="text-left">IN'+secao+'</td>' +
						'<td class="text-center">'+codProduto+'</td>' +
						'<td class="text-right">'+quantidade+' '+tipoQuantidade+'</td>' +
						'<td class="text-right"><a href="#" class="btnRemoverProduto" data-id="'+reference+'" title="remover produto"><i class="bi bi-trash"></a></td>' +
						'</tr>';
			$('#tabelaDeProdutos tbody').append(linha);
			++countProdutos;
		}
	}
	
	if (countProdutos == 0) {
		$('#resultadoDaBusca').text('NENHUM PRODUTO ENCONTRADO!');
	} else {
		//adiciona a soma no final da tabela
		var table = '<h2 class="h2 w-100 text-center">TOTAL</h2>';
		table += '<table class="table table-sm table-striped border" style="margin-top: 20px">';
		table += '<tr><th class="text-left">GR</th>';
		table += '<th class="text-center">KG</th><th class="text-center">PCT</th>';
		table += '<th class="text-center">CXA</th><th class="text-right">UND</th></tr>';
		table += '<tr>';
		table += '<th class="text-left">'+somaProdutos['gr']+'</th>';	
		table += '<th class="text-center">'+somaProdutos['kg']+'</th>';	
		table += '<th class="text-center">'+somaProdutos['pct']+'</th>';
		table += '<th class="text-center">'+somaProdutos['cxa']+'</th>';
		table += '<th class="text-right">'+somaProdutos['und']+'</th>';
		table += '</tr></table>';	
		$('#resultadoDaBusca').html(table);		
		$('#tabelaDeProdutos').show();
	}
}

