@extends('layouts.default')

@section('styles')
<?php foreach($styles as $s): ?>
    <link rel="stylesheet" href="<?php echo $s.'?v='.date('YmdHi'); ?>">
<?php endforeach; ?>
@stop

@section('content')
<div class="container d-flex align-items-center" style="height:90vh">
    <div class="row justify-content-center w-100">
        <div class="col-8" id="login-div" @if(Auth::check()) hidden @endif>
            <div class="card">
                <div class="card-body d-flex align-items-center justify-content-center" style="height:60vh;overflow-y:auto;">
                    <form id="login-form">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" id="exampleInputPassword1">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-8" id="todo-div" @if(!Auth::check()) hidden @endif>
            <div class="card">
                <div class="card-header d-flex justify-content-between">
                    <input class="form-contrul mr-2" style="width:80%" type="text" id="in-text">
                    <button class="ml-2 btn btn-outline-danger" id="btn-add">
                        <i class="bi bi-send-plus-fill"></i>
                    </button>
                </div>
                <div class="card-body" style="height:60vh;overflow-y:auto;">
                    <ul class="list-group" id="item-list">
                        
                        
                        
                    </ul>
                </div>
            </div>
        </div>

    </div>



</div>

@stop

@section('scripts')
    <?php foreach($scripts as $s): ?>
        <script src="<?php echo $s.'?v='.date('YmdHi'); ?>"></script>
    <?php endforeach; ?>

    <script type="module">
        import Page from '<?= $pageScript.'?v='.date('YmdHi') ?>';

        const page  =  new Page();
    </script>
@stop