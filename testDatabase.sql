-- Work in progress, might change certain types, as well as adding new columns.
-- We need to look into G-mail API and change database correspondingly.
-- No sample are created yet, we can create a mutual G-mail account for testing purpose

CREATE TABLE Users(
	account varchar(255) PRIMARY KEY
);

CREATE TABLE Vendor(
	name varchar(255) PRIMARY KEY
);

CREATE TABLE Subscription(
	id int,
    vendor_name varchar(255),
    PRIMARY KEY(id, vendor_name),
    FOREIGN KEY(vendor_name) REFERENCES Vendor(name)
);

CREATE TABLE User_Sub(
	user_account varchar(255),
    sub_id int,
    unsubscribe_into varchar(255),
    unsubscribe_link varchar(255),
    PRIMARY KEY(user_account, sub_id),
    FOREIGN KEY(user_account) REFERENCES User(account),
    FOREIGN KEY(sub_id) REFERENCES Subscription(id)
);