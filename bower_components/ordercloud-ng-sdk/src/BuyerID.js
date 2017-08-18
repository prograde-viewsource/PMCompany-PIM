function BuyerID() {
    return {
        'Get': _get,
        'Set': _set
    };

    function _get() {
        return $cookieStore.get(appname + '.buyerID');
    }

    function _set(value) {
        $cookieStore.put(appname + '.buyerID', value);
    }
}