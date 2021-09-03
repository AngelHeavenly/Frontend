jQuery(document).ready(function()
                       {
  var resultEl=jQuery('#resultCompute').text();
  var itemMapDims=new Map();
  var copyItem=function()
  {
    return jQuery('#item0').clone();}
var copyItemSel=function()
{
  return jQuery('#item0 #items').clone();
};
  var copySizeSel=function()
  {
    return jQuery('#item0 #sizes').clone();
  };
  var copyDiaSel=function()
  {
    return jQuery('#item0 #dias').clone();
  };
  var copyCellSel=function()
  {
    return jQuery('#item0 #cells').clone();
  };
  var copyAmount=function()
  {
    return jQuery('#item0 #amount').clone();
  };
  var items=[];
  var countItem=0;
  items.push("item"+countItem);
  function getDiv($object)
  {
    for(let i=0;i<items.length;i++)
    {
      if($object.closest("#"+items[i]).length!==0)
      {
        return $object.closest("#"+items[i]);
      }
    }
  }
function getDivStart()
  {
    return jQuery(".selectItem").parent().parent().attr("id");
  }
function mapToJson(map)
  {
    return JSON.stringify([...map]);
  }
jQuery.getJSON('http://zabor-fence.ru/wp-content/uploads/custom-css-js/getItem.php',function(data)
               {
  let divEl=getDivStart();
  jQuery('#'+divEl+' '+'.selectItem option').remove();
  jQuery('#'+divEl+' '+'.selectItem').append(new Option("Ничего не выбрано","noSelected"));
  jQuery.each(data,function(key,val)
{
    itemMapDims.set(val.val,[val.size,val.diameter,val.cell])
jQuery('#'+divEl+' '+'.selectItem').append(new Option(val.key,val.val));});});
  jQuery('body').on('change','.selectItem',function()
                    {
    let $divEl=getDiv(jQuery(this));
    let itemValue=$divEl.find(".selectItem").val();
    let dimArray=itemMapDims.get(itemValue);
    $divEl.find("#label1").text(dimArray[0]);
    $divEl.find("#label2").text(dimArray[1]);
    $divEl.find("#label3").text(dimArray[2]);
    $divEl.find('.selectDia option').remove();
    $divEl.find('.selectDia').append(new Option('Выберите '+dimArray[0],'noSelected'));
    $divEl.find('.selectCell option').remove();
    $divEl.find('.selectCell').append(new Option('Выберите '+dimArray[1],'noSelected'));
    jQuery.getJSON('http://zabor-fence.ru/wp-content/uploads/custom-css-js/getSize.php',{item:itemValue},
                   function(data)
                   {
      $divEl.find(".selectSize option").remove();
      $divEl.find('.selectSize').append(new Option("Ничего не выбрано","noSelected"));
      jQuery.each(data,function(key,val)
                  {
        if(val.special_value!=null)
        {
          $divEl.find("#label1").text("Специальное предложение");
          $divEl.find(".selectSize").append(new Option(val.special_value,val.special_value))
        }
$divEl.find(".selectSize").append(new Option(val.sizes,val.sizes));});});});
  jQuery('body').on('click','.selectSize',function()
                    {
    let $divEl=getDiv(jQuery(this));
    let sizeValue=$divEl.find(".selectSize").val();
    let itemValue=$divEl.find(".selectItem").val();
    jQuery.getJSON('http://zabor-fence.ru/wp-content/uploads/custom-css-js/getDia.php',{item:itemValue,size:sizeValue},
                   function(data)
                   {
      $divEl.find(".selectDia option").remove();
      $divEl.find('.selectDia').append(new Option("Ничего не выбрано","noSelected"));
      jQuery.each(data,function(key,val){$divEl.find(".selectDia").append(new Option(val.diameters_value,val.diameters_value));});});});
  jQuery('body').on('click','.selectDia',
                    function()
                    {
    let $divEl=getDiv(jQuery(this));
    let sizeValue=$divEl.find(".selectSize").val();
    let itemValue=$divEl.find(".selectItem").val();
    let diaValue=$divEl.find(".selectDia").val();
    jQuery.getJSON('http://zabor-fence.ru/wp-content/uploads/custom-css-js/getCells.php',{item:itemValue,size:sizeValue,dia:diaValue},
                   function(data)
                   {
      $divEl.find(".selectCell option").remove();
      $divEl.find('.selectCell').append(new Option("Ничего не выбрано","noSelected"));
      jQuery.each(data,function(key,val)
                  {
        $divEl.find(".selectCell").append(new Option(val.cell_value,val.cell_value));});});});
  jQuery("#addItem").click(function(){if(countItem!==16){countItem++;items.push("item"+countItem);
                                                         var clonedItem=copyItem();
                                                         clonedItem.attr("id","item"+countItem);
                                                         jQuery("#"+items[countItem-1]).after(clonedItem);
                                                        }
                                      else
                                      {
                                        alert("Товаров не может быть больше 16");}});
  jQuery('#compute').click(
    function()
    {
      let objectArray=[];
      for(let i=0;i<=countItem;i++)
      {
        let objectElement={};
        let item=jQuery("#"+items[i]).find('.selectItem').val();
        let size=jQuery("#"+items[i]).find('.selectSize').val();
        let dia=jQuery("#"+items[i]).find('.selectDia').val();
        let cell=jQuery("#"+items[i]).find('.selectCell').val();
        let amount=jQuery("#"+items[i]).find('.amount').val();
        if(size==='noSelected'||dia==='noSelected'||cell==='noSelected')
        {
          alert('Есть незаполненные значения у товаров!')
return;}
if(amount===''||parseInt(amount)<=0){alert('Количество товара пусто, либо меньше 1! Введите корректные данные');return;}
objectElement.item=item;objectElement.size=size;objectElement.dia=dia;objectElement.cell=cell;objectElement.amount=amount;objectArray[i]=objectElement;}
jQuery.post("http://zabor-fence.ru/wp-content/uploads/custom-css-js/compute.php",JSON.stringify(objectArray),function(data){var sum;jQuery.each(data,function(key,val){sum=val;});jQuery('#resultCompute').text(resultEl+' '+sum);},'json');});jQuery(".calculated").on("click","a",function(event){event.preventDefault();var id=jQuery(this).attr('href'),top=jQuery(id).offset().top;jQuery('body,html').animate({scrollTop:top},1500);});});
jQuery(document).ready(function(){jQuery("a").click(function(event){if(this.closest(".calculated")!==null&&this.closest(".calculated").length!==0){event.preventDefault();console.log("yes");var id=jQuery(this).attr('href'),top=jQuery(id).offset().top;jQuery('body,html').animate({scrollTop:top},1500);}});});
