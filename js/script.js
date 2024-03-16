$(function () {
    $("#navbarToggle").blur(function (event) {
      var larguraDaTela = window.innerWidth;
      if (larguraDaTela < 768) {
        $("#collapsable-nav").collapse('hide');
      }
    });
  });
  
  (function (global) {
  
  var dc = {};
  
  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  
  var insertHtml = function (selector, html) {
    var targetElement = document.querySelector(selector);
    targetElement.innerHTML = html;
  };
  
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };
  
  var insertProperty = function (string, propertyName, propertyValue) {
    var propToReplace = "{{" + propertyName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propertyValue);
    return string;
  };
  
  var switchMenuToActive = function () {
    var homeButtonClasses = document.querySelector("#navHomeButton").className;
    homeButtonClasses = homeButtonClasses.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = homeButtonClasses;
  
    var menuButtonClasses = document.querySelector("#navMenuButton").className;
    if (menuButtonClasses.indexOf("active") === -1) {
      menuButtonClasses += " active";
      document.querySelector("#navMenuButton").className = menuButtonClasses;
    }
  };
  
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML,
      true);
  });
  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        // PASSO 2: Escolher uma categoria aleatória
        var chosenCategory = chooseRandomCategory(categories);
        var chosenCategoryShortName = chosenCategory.short_name;
  
        // PASSO 3: Substituir {{randomCategoryShortName}} no trecho HTML da home
        var homeHtmlToInsert = insertProperty(homeHtml, "randomCategoryShortName", chosenCategoryShortName);
  
        // PASSO 4: Inserir o HTML produzido na página principal
        insertHtml("#main-content", homeHtmlToInsert);
  
        // Carregar itens do menu para a categoria escolhida
        $dc.loadMenuItems(chosenCategoryShortName);
      },
      false);
    }
    // Corrigindo a duplicação de código

    // Dado um array de objetos de categoria, retorna um objeto de categoria aleatório.
    function chooseRandomCategory(categories) {
        var randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }

    // Carrega a visualização de categorias do menu
    dc.loadMenuCategories = function () {
        mostrarCarregando("#conteudoPrincipal");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };

    // Carrega a visualização de itens de menu
    // 'categoryShort' é um short_name para uma categoria
    dc.loadMenuItems = function (categoryShort) {
        mostrarCarregando("#conteudoPrincipal");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort + ".json",
            buildAndShowMenuItemsHTML);
    };
    // Corrigindo a chamada da função de construção e exibição dos itens de menu
    // Carrega a visualização dos itens de menu
    // 'categoryShort' é um short_name para uma categoria
    dc.loadMenuItems = function (categoryShort) {
        mostrarCarregando("#conteudoPrincipal");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort + ".json",
            buildAndShowMenuItemsHTML); // Corrigindo o nome da função
    };

    // Constrói o HTML para a página de categorias com base nos dados do servidor
    function buildAndShowCategoriesHTML(categories) { // Corrigindo o nome da função
        // Carrega trecho de título da página de categorias
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                // Recupera trecho de categoria único
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        // Muda classe CSS ativa para o botão de menu
                        switchMenuToActive();

                        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#conteudoPrincipal", categoriesViewHtml);
                    },
                    false);
            },
            false);
    };
    // Usando os dados das categorias e snippets HTML, construa HTML da visualização de categorias para ser inserido na página
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var htmlFinal = categoriesTitleHtml;
        htmlFinal += "<section class='row'>";

        // Loop sobre categorias
        for (var i = 0; i < categories.length; i++) {
            // Insere valores da categoria
            var html = categoryHtml;
            var nome = categories[i].nome; // Removido o uso de uma string vazia e o operador de concatenação
            var shortName = categories[i].short_name; // Alterado o nome da variável para seguir a convenção camelCase
            html = insertProperty(html, "nome", nome);
            html = insertProperty(html, "short_name", shortName); // Alterado o nome da variável para seguir a convenção camelCase
            htmlFinal += html;
        }

        htmlFinal += "</section>";
        return htmlFinal;
    };
    // Constrói o HTML para a página de itens de menu com base nos dados do servidor
    function buildAndShowMenuItemsHTML(menuItemsCategory) {
        // Carrega trecho de título da página de itens de menu
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            function (menuItemsTitleHtml) {
                // Recupera trecho de item de menu único
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function (menuItemHtml) {
                        // Muda classe CSS ativa para o botão de menu
                        changeMenuToActive();

                        var htmlMenuItemsView =
                            buildMenuItemsViewHtml(menuItemsCategory,
                                                menuItemsTitleHtml,
                                                menuItemHtml);
                        insertHtml("#conteudoPrincipal", htmlMenuItemsView);
                    },
                    false);
            },
            false);
    };
    // Usando os dados da categoria e itens de menu e snippets HTML,
    // construa HTML da visualização de itens de menu para ser inserido na página
    function buildMenuItemsViewHtml(menuItemsCategory, menuItemsTitleHtml, menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "nome", menuItemsCategory.categoria.nome);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "instrucoes_especiais", menuItemsCategory.categoria.instrucoes_especiais);

        var htmlFinal = menuItemsTitleHtml;
        htmlFinal += "<section class='row'>";

        // Loop sobre os itens de menu
        var itensMenu = menuItemsCategory.itens_menu;
        var shortNameCategoria = menuItemsCategory.categoria.short_name;
        for (var i = 0; i < itensMenu.length; i++) {
            // Insere valores do item de menu
            var html = menuItemHtml;
            html = insertProperty(html, "short_name", itensMenu[i].short_name);
            html = insertProperty(html, "shortNameCategoria", shortNameCategoria);
            html = insertPriceItem(html, "preco_pequeno", itensMenu[i].preco_pequeno);
            html = insertNamePortionItem(html, "nome_porção_pequena", itensMenu[i].nome_porção_pequena);
            html = insertPriceItem(html, "preco_grande", itensMenu[i].preco_grande);
            html = insertNamePortionItem(html, "nome_porção_grande", itensMenu[i].nome_porção_grande);
            html = insertProperty(html, "nome", itensMenu[i].nome);
            html = insertProperty(html, "descrição", itensMenu[i].descrição);

            // Adiciona clearfix após cada segundo item de menu
            if (i % 2 !== 0) {
                html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            htmlFinal += html;
        }

        htmlFinal += "</section>";
        return htmlFinal;
    };
    // Anexa o preço com '$' se o preço existir
    function insertPriceItem(html, pricePropertyName, priceValue) {
        // Se não especificado, substitua por uma string vazia
        if (!priceValue) {
            return insertProperty(html, pricePropertyName, "");
        }

        // Anexa o preço com '$' e arredonda para duas casas decimais
        var formattedPrice = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropertyName, formattedPrice);
        return html;
    }

    // Anexa o nome da porção em parênteses se existir
    function insertNamePortionItem(html, portionPropertyName, portionValue) {
        // Se não especificado, retorne a string original
        if (!portionValue) {
            return insertProperty(html, portionPropertyName, "");
        }

        // Anexa o nome da porção em parênteses
        var formattedPortion = "(" + portionValue + ")";
        html = insertProperty(html, portionPropertyName, formattedPortion);
        return html;
    }
})(window);

