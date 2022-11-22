<!DOCTYPE html>
<html lang="en">
<head>
    @include('includes.header')
    
    @yield('styles')
</head>
<body>
    @yield('content')

    <footer>
    @include('includes.footer')
    </footer>
    <script type="text/javascript"  src="/system/global/swal.js"></script>
    @yield('scripts')
</body>
</html>