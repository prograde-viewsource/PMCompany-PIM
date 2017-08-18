function CatalogID() {
    return {
        'Get': _get,
        'Set': _set
    };

    function _get() {
        return $cookieStore.get(appname + '.catalogID');
    }

    function _set(value) {
        $cookieStore.put(appname + '.catalogID', value);
    }
}