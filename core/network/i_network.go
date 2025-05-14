package interfaces

type GetParams struct {
	URL             string
	QueryParameters map[string]string
	Headers         map[string]string
}

type PostParams struct {
	URL             string
	QueryParameters map[string]string
	Headers         map[string]string
	Body            interface{}
}

type PutParams struct {
	URL             string
	QueryParameters map[string]string
	Headers         map[string]string
	Body            interface{}
}

type DeleteParams struct {
	URL             string
	QueryParameters map[string]string
	Headers         map[string]string
}

type PatchParams struct {
	URL             string
	QueryParameters map[string]string
	Headers         map[string]string
	Body            interface{}
}

type INetwork interface {
	Get(params GetParams) ([]byte, error)
	Post(params PostParams) ([]byte, error)
	Put(params PutParams) ([]byte, error)
	Delete(params DeleteParams) ([]byte, error)
	Patch(params PatchParams) ([]byte, error)
}
