-- public.countries definition

-- Drop table

-- DROP TABLE public.countries;

CREATE TABLE public.countries (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	code varchar(3) NOT NULL,
	currency varchar(3) NOT NULL,
	currency_symbol varchar(10) NULL,
	supported_payment_methods jsonb NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT countries_pkey PRIMARY KEY (id)
);


-- public.dashboard_settings definition

-- Drop table

-- DROP TABLE public.dashboard_settings;

CREATE TABLE public.dashboard_settings (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	tenant_id int4 NOT NULL,
	layout jsonb NULL,
	widgets jsonb NULL,
	theme varchar(50) DEFAULT 'default'::character varying NULL,
	color_scheme varchar(50) DEFAULT 'light'::character varying NULL,
	default_view varchar(50) DEFAULT 'overview'::character varying NULL,
	favorites jsonb NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT dashboard_settings_pkey PRIMARY KEY (id)
);


-- public.subscription_plans definition

-- Drop table

-- DROP TABLE public.subscription_plans;

CREATE TABLE public.subscription_plans (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	price int4 NOT NULL,
	"interval" varchar(20) NOT NULL,
	description text NULL,
	features jsonb NULL,
	product_limit int4 NOT NULL,
	user_limit int4 NOT NULL,
	active bool DEFAULT true NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT subscription_plans_pkey PRIMARY KEY (id)
);


-- public.tenants definition

-- Drop table

-- DROP TABLE public.tenants;

CREATE TABLE public.tenants (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	subdomain varchar(100) NOT NULL,
	store_name varchar(255) NOT NULL,
	country_id int4 NOT NULL,
	subscription_plan_id int4 NULL,
	business_document varchar(100) NULL,
	whatsapp_number varchar(50) NULL,
	address text NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	active bool DEFAULT true NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT tenants_pkey PRIMARY KEY (id),
	CONSTRAINT tenants_subdomain_key UNIQUE (subdomain),
	CONSTRAINT fk_tenants_country FOREIGN KEY (country_id) REFERENCES public.countries(id),
	CONSTRAINT fk_tenants_subscription_plan FOREIGN KEY (subscription_plan_id) REFERENCES public.subscription_plans(id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	username varchar(100) NOT NULL,
	"password" text NOT NULL,
	email varchar(255) NOT NULL,
	first_name varchar(100) NULL,
	last_name varchar(100) NULL,
	"role" text DEFAULT 'user'::text NULL,
	tenant_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username),
	CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);


-- public.categories definition

-- Drop table

-- DROP TABLE public.categories;

CREATE TABLE public.categories (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	tenant_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (id),
	CONSTRAINT fk_categories_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);


-- public.payments definition

-- Drop table

-- DROP TABLE public.payments;

CREATE TABLE public.payments (
	id serial4 NOT NULL,
	tenant_id int4 NOT NULL,
	subscription_plan_id int4 NOT NULL,
	amount int4 NOT NULL,
	currency varchar(3) NOT NULL,
	payment_method varchar(50) NOT NULL,
	status varchar(20) NOT NULL,
	transaction_id varchar(255) NULL,
	payment_data jsonb NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id),
	CONSTRAINT fk_payments_subscription_plan FOREIGN KEY (subscription_plan_id) REFERENCES public.subscription_plans(id),
	CONSTRAINT fk_payments_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	price int4 NOT NULL,
	main_image text NULL,
	images jsonb NULL,
	on_sale bool DEFAULT false NULL,
	sale_price int4 NULL,
	category_id int4 NULL,
	tenant_id int4 NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES public.categories(id),
	CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);