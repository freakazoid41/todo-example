<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Upload;

class System extends Controller
{
    public function index(Request $request,$model,$id = 0)
    {
        $model = 'App\\Models\\'.$model;
        switch(strtoupper($request->method())){
            case "GET":
                $res = [];
                if($id != 0){
                    $res = $model::where('id',$id)->first();
                }else{
                    $res = $model::all();
                }
				$res = $res->toarray();
                //get request for data getting
                return response()->json([
                    'success' => !empty($res),
                    'data' => $res,
                ]);
            break;
			case "POST":
				$res = $model::create($_POST);
				return response()->json([
                    'success' => $res->id > 0,
                    'data' => $res,
                ]);
            break;
			case "PUT":
				if(isset($model)){
					//patch request for data updating
					$res = $model::where('id', $id)->update($request->all());
					return response()->json([
						'success' => $res,
					]);
				}
			break;
			case "DELETE":
				if(isset($model)){
					//delete request for data removing
					//$res = $model::where('id', $id)->delete();
                    $res = $model::where('id', $id)->get();
                    $res = $res[0]->delete();

					return response()->json([
						'success' => $res,
					]);
				}
            break;
        }
	}

	 /***
	 * this method will contains crud operations routing
	 */
	public function query($model){
		
        $model = 'App\\Models\\'.$model;
		
		$rsp = array(
            'success' => false
        );

		$response = $model::where($_POST)->get()->toArray();
		$rsp['success'] = count($response) > 0;
		$rsp['data']    = $response;
        
        return response()->json($rsp);
	}

	/**
     * this method will contains file uploading transactions
     */
    /*public function upload(Request $request)
    {
      $uploadedFile = $request->file('file');
      $filename = time().$uploadedFile->getClientOriginalName();

      $rsp = Storage::disk('public')->putFileAs(
        'images',
        $uploadedFile,
        $filename
      );
	
	  return response()->json([
        'data' => $filename,
		'rsp'  => $rsp
      ]);
    }*/
}
