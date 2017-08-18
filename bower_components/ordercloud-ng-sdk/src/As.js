function As() {
    impersonating = true;

	if (typeof arguments[0] == 'string') {
		Auth().SetImpersonationToken(arguments[0]);
	}

	return this;
}
