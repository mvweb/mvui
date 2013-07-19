<?php


$data = array(
	array('id'=>1,'name'=>'www'),
	array('id'=>2,'name'=>''),
	array('id'=>3,'name'=>'bb'),
	array('id'=>4,'name'=>'cc'),
	array('id'=>1,'name'=>'www'),
	array('id'=>2,'name'=>'aa'),
	array('id'=>3,'name'=>'bb'),
	array('id'=>4,'name'=>'cc'),
	array('id'=>1,'name'=>'www'),
	array('id'=>2,'name'=>'aa'),
	array('id'=>3,'name'=>'bb'),
	array('id'=>4,'name'=>'cc'),
	array('id'=>1,'name'=>'www'),
	array('id'=>2,'name'=>'aa'),
	array('id'=>3,'name'=>'bb'),
	array('id'=>4,'name'=>'cc'),
	array('id'=>1,'name'=>'www'),
	array('id'=>2,'name'=>'aa'),
	array('id'=>3,'name'=>'bb'),
	array('id'=>4,'name'=>'cc'),
);

$sort = isset($_POST['sort'])?$_POST['sort']:'';
$page = isset($_POST['page'])?$_POST['page']:1;
$search = isset($_POST['search'])?$_POST['search']:'';
if(!empty($search)){
	$data = array_filter($data,'search');
}

$total = count($data);
$pagesize = isset($_POST['pagesize'])?$_POST['pagesize']:10;

$totalPage = ceil($total/$pagesize);

$start = ($page-1)*$pagesize;
//$end = 1;
$prev = $page -1;
$prev = $prev<1?false:$prev;
$next = $page+1;
$next = $next <= $totalPage?$next:false;

if($sort){
	list($sortKey,$type) = explode('.',$sort);
	$sortType = $type == 'asc'?SORT_ASC:SORT_DESC; 
	$data = multiArraySort($data,$sortKey,$sortType);
}
$data = array_slice($data, $start,$pagesize);

echo json_encode(array('status'=>0,'data'=>array(
		'items'=>$data,
		'pagination'=>array(
			'current'=>$page,
			'prev'=>$prev,
			'next'=>$next,
			'pages'=>$totalPage,
			'total'=>$total
		)
	),'msg'=>''));



function multiArraySort($multiArr,$sortKey,$sortType = SORT_ASC){
		$sortKeyArr = array();
		if(is_array($multiArr)){
			foreach($multiArr as $arrItem){
				if(is_array($arrItem) && isset($arrItem[$sortKey])){
					$sortKeyArr[] = $arrItem[$sortKey];
				}else{
					return false;
				}
			}
		}else{
			return false;
		}
		array_multisort($sortKeyArr,$sortType,$multiArr);	
		return $multiArr;
}


function search($item){
	global $search;
	return strstr($item['name'],$search)!=false;
}