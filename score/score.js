//配列
var score = [];

//ローカルストレージ読み込み
var get_score = localStorage.getItem('touch_numbers_score');

//ローカルストレージの中身がある時のみ配列を再現
if( get_score != null){
  score = JSON.parse(get_score);
}


var append_list = "<tr><th>プレイ回数</th><th>スコア（タイム）</th></tr>";


function score_refresh(){

  $('#score_table').empty();

  //スコア更新
  for ( var i = score.length-1; i > -1; i-- ) {

    append_list += "<tr><td>"+(i+1)+"</td><td>"+score[i]+"</td></tr>";

  }

  $('#score_table').html(append_list);

  append_list = "";
  append_list = "<tr><th>プレイ回数</th><th>スコア（タイム）</th></tr>";

}

//メニューボタン
$(document).on('click', '#menu-btn', function(){
  location.href="./index.html";
})

//削除ボタン
$(document).on('click', '#delete-btn', function(){

var delete_confirm = window.prompt("スコアを全削除します。\nよろしいですか？\nよろしければ、以下に「delete」と入力して下さい。");

if(delete_confirm == "delete"){
  localStorage.removeItem("touch_numbers_score");

  $('#score_table').html(append_list);
  $('#score_table').empty();
  append_list = "";
  append_list = "<tr><th>プレイ回数</th><th>スコア（タイム）</th></tr>";
  $('#score_table').html(append_list);
  alert("削除しました。");
}

})

score_refresh();

