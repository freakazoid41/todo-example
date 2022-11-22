<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //

    public function createUser(Request $request){
        try{    
            //validate request sended parameters
            $validateUser = Validator::make($request->all(),[
                'name'     => 'required',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'success' => false,
                    'message' => 'Form Validate Error',
                    'error'   => $validateUser->errors()
                ],401);
            }

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password)
            ]);


            return response()->json([
                'success' => true,
                'message' => 'User Created..',
                'token'   => $user->createToken("API TOKEN")->plainTextToken
            ],200);



        }catch(\Throwable $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                
            ],500);
        }
    }

    public function loginUser(Request $request){
        try {
            //validate request sended parameters
            $validateUser = Validator::make($request->all(),[
                'email'    => 'required|email',
                'password' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'success' => false,
                    'message' => 'Form Validate Error',
                    'error'   => $validateUser->errors()
                ],401);
            }
            
            if(!Auth::attempt($request->only(['email','password']))){
                return response()->json([
                    'success' => false,
                    'message' => 'User Cannot Found',
                    'error'   => $validateUser->errors()
                ],401);
            }

            $user = User::where('email',$request->email)->first();

            return response()->json([
                'success' => true,
                'message' => 'User Logged In',
                'token'   => $user->createToken("API TOKEN")->plainTextToken
            ],200);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                
            ],500);
        }
    }
}
