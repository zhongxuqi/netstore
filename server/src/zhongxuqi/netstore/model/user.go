package model

const (
	// ROOT the user flag for User.Role
	ROOT = "root"
)

// User the struct of user
type User struct {
	PassWord string `json:"-" bson:"password"`
	Role     string `json:"role" bson:"role"`
	Language string `json:"language" bson:"language"`
	Phone    string `json:"phone" bson:"phone"`
	Address  string `json:"address" bson:"address"`
}
