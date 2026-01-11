--
-- PostgreSQL database dump
--

\restrict wJ5UPCKcwV1350mT6Dho6gsE0NobwqMDYdstQdtui8gapTZft9R2x1dIGk04apw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: product_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_status_enum AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


ALTER TYPE public.product_status_enum OWNER TO postgres;

--
-- Name: increment_settings_version(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_settings_version() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE settings_version SET version = version + 1, updated_at = NOW() WHERE id = 1;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.increment_settings_version() OWNER TO postgres;

--
-- Name: set_ticket_closed_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_ticket_closed_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status = 'closed' AND (OLD.status IS NULL OR OLD.status != 'closed') THEN
        NEW.closed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_ticket_closed_at() OWNER TO postgres;

--
-- Name: set_ticket_resolved_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_ticket_resolved_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status = 'resolved' AND (OLD.status IS NULL OR OLD.status != 'resolved') THEN
        NEW.resolved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_ticket_resolved_at() OWNER TO postgres;

--
-- Name: update_ticket_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_ticket_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_ticket_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    admin_email character varying(255) NOT NULL,
    event_type character varying(100) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(255) NOT NULL,
    before jsonb,
    after jsonb,
    changes jsonb,
    ip_address character varying(45) NOT NULL,
    user_agent text,
    created_at timestamp without time zone DEFAULT now(),
    entity_name character varying(255)
);


ALTER TABLE public.admin_audit_logs OWNER TO postgres;

--
-- Name: auth_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    role character varying DEFAULT 'USER'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    last_login_at timestamp without time zone,
    auth_provider character varying NOT NULL,
    password_hash text
);


ALTER TABLE public.auth_users OWNER TO postgres;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cart_id uuid NOT NULL,
    product_id uuid,
    variant_id uuid,
    quantity integer NOT NULL,
    price_snapshot numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying NOT NULL,
    product_title text,
    product_image text,
    variant_label text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    status character varying DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    scheduled_start timestamp without time zone,
    scheduled_end timestamp without time zone,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- Name: discount_target_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_target_groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    discount_id uuid,
    group_type character varying(20) NOT NULL,
    group_value_uuid uuid,
    group_value_text character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_group_target CHECK (((((group_type)::text = 'COLLECTION'::text) AND (group_value_uuid IS NOT NULL)) OR (((group_type)::text = ANY ((ARRAY['TYPE'::character varying, 'CATEGORY'::character varying])::text[])) AND (group_value_text IS NOT NULL))))
);


ALTER TABLE public.discount_target_groups OWNER TO postgres;

--
-- Name: discount_usages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_usages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    discount_id uuid NOT NULL,
    user_id uuid,
    order_id uuid NOT NULL,
    used_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.discount_usages OWNER TO postgres;

--
-- Name: discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    type character varying(20) DEFAULT 'PERCENT'::character varying NOT NULL,
    value numeric(10,2) DEFAULT 0 NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    scope character varying(20) DEFAULT 'PRODUCT'::character varying NOT NULL,
    audience character varying(20) DEFAULT 'ALL'::character varying NOT NULL,
    min_order_amount numeric(10,2) DEFAULT 0,
    min_user_orders integer DEFAULT 0,
    min_user_ltv numeric(10,2) DEFAULT 0,
    global_usage_limit integer,
    per_user_limit integer DEFAULT 1,
    priority integer DEFAULT 1,
    is_stackable boolean DEFAULT false,
    max_stack_count integer DEFAULT 1,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT check_discount_value CHECK (((((type)::text = 'PERCENT'::text) AND (value >= (0)::numeric) AND (value <= (100)::numeric)) OR (((type)::text = 'FLAT'::text) AND (value >= (0)::numeric))))
);


ALTER TABLE public.discounts OWNER TO postgres;

--
-- Name: email_otp_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_otp_codes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    attempt_count integer DEFAULT 0 NOT NULL,
    otp_hash text NOT NULL
);


ALTER TABLE public.email_otp_codes OWNER TO postgres;

--
-- Name: login_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    user_email character varying(255) NOT NULL,
    user_type character varying(20) NOT NULL,
    event_type character varying(50) NOT NULL,
    login_method character varying(50),
    ip_address character varying(45) NOT NULL,
    user_agent text,
    success boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.login_audit_logs OWNER TO postgres;

--
-- Name: TABLE login_audit_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.login_audit_logs IS 'High-frequency login/logout audit trail for both users and admins';


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: oauth_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    provider character varying NOT NULL,
    provider_user_id text NOT NULL,
    email character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.oauth_accounts OWNER TO postgres;

--
-- Name: order_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    full_name character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    address_line_1 character varying NOT NULL,
    address_line_2 character varying,
    landmark character varying,
    city character varying NOT NULL,
    state character varying NOT NULL,
    postal_code character varying NOT NULL,
    country character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_addresses OWNER TO postgres;

--
-- Name: order_discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_discounts (
    order_id uuid NOT NULL,
    discount_id uuid NOT NULL,
    discount_code character varying(50) NOT NULL,
    discount_type character varying(20) NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    applied_amount numeric(10,2) NOT NULL
);


ALTER TABLE public.order_discounts OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    variant_id uuid NOT NULL,
    product_name_snapshot character varying NOT NULL,
    variant_label_snapshot character varying NOT NULL,
    sku_snapshot character varying NOT NULL,
    image_url_snapshot character varying,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
    line_total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_line_total_positive CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT chk_quantity_positive CHECK ((quantity > 0))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    from_status character varying,
    to_status character varying NOT NULL,
    changed_by uuid,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_status_history OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_number character varying NOT NULL,
    user_id uuid NOT NULL,
    status character varying DEFAULT 'pending_payment'::character varying NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    shipping_amount numeric(10,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying NOT NULL,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_order_id character varying,
    CONSTRAINT chk_order_status CHECK (((status)::text = ANY ((ARRAY['pending_payment'::character varying, 'payment_failed'::character varying, 'processing'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT chk_total_positive CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    provider character varying DEFAULT 'razorpay'::character varying NOT NULL,
    provider_payment_id character varying,
    provider_order_id character varying,
    amount numeric(10,2) NOT NULL,
    refunded_amount numeric(10,2) DEFAULT 0 NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying NOT NULL,
    status character varying DEFAULT 'initiated'::character varying NOT NULL,
    payment_method character varying,
    failure_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_amount_positive CHECK ((amount >= (0)::numeric)),
    CONSTRAINT chk_payment_status CHECK (((status)::text = ANY ((ARRAY['initiated'::character varying, 'pending'::character varying, 'authorized'::character varying, 'captured'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: product_collection_map; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_collection_map (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    collection_id uuid NOT NULL,
    "position" integer DEFAULT 0,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_collection_map OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    url text NOT NULL,
    alt_text character varying(255),
    status character varying(10) DEFAULT 'TEMP'::character varying,
    is_primary boolean DEFAULT false,
    display_order integer DEFAULT 0,
    expires_at timestamp without time zone,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    size character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sku_locked boolean DEFAULT false,
    price_override numeric(10,2),
    weight numeric(10,2)
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    status public.product_status_enum DEFAULT 'DRAFT'::public.product_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    inventory_mode character varying(10) DEFAULT 'SINGLE'::character varying,
    base_price numeric(10,2) DEFAULT 0 NOT NULL,
    version integer DEFAULT 1,
    compare_at_price numeric(10,2),
    cost_per_item numeric(10,2),
    currency character varying(3) DEFAULT 'INR'::character varying,
    taxable boolean DEFAULT true,
    track_inventory boolean DEFAULT true,
    continue_selling_when_out_of_stock boolean DEFAULT false,
    low_stock_threshold integer,
    product_type character varying(50),
    category character varying(50),
    sku character varying(100),
    stock_quantity integer DEFAULT 0,
    is_featured boolean DEFAULT false
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    token_hash text NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    value jsonb NOT NULL,
    environment character varying(20) DEFAULT 'production'::character varying NOT NULL,
    section character varying(50) GENERATED ALWAYS AS (split_part((key)::text, '.'::text, 1)) STORED,
    is_active boolean DEFAULT true,
    is_published boolean DEFAULT true,
    version integer DEFAULT 1,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    setting_id uuid NOT NULL,
    key character varying(255) NOT NULL,
    value jsonb NOT NULL,
    environment character varying(20) NOT NULL,
    changed_by uuid,
    change_reason text,
    previous_version integer NOT NULL,
    changed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.settings_history OWNER TO postgres;

--
-- Name: settings_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings_version (
    id integer DEFAULT 1 NOT NULL,
    version bigint DEFAULT 1,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT only_one_row CHECK ((id = 1))
);


ALTER TABLE public.settings_version OWNER TO postgres;

--
-- Name: shipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    carrier character varying,
    tracking_number character varying,
    status character varying DEFAULT 'shipped'::character varying NOT NULL,
    shipped_at timestamp without time zone,
    delivered_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_shipment_status CHECK (((status)::text = ANY ((ARRAY['shipped'::character varying, 'delivered'::character varying])::text[])))
);


ALTER TABLE public.shipments OWNER TO postgres;

--
-- Name: shipping_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    house_number character varying(100) NOT NULL,
    address character varying(500) NOT NULL,
    landmark character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    address_type character varying(20) DEFAULT 'home'::character varying NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.shipping_addresses OWNER TO postgres;

--
-- Name: ticket_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ticket_id uuid NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    is_admin_reply boolean DEFAULT false,
    attachments jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ticket_messages OWNER TO postgres;

--
-- Name: ticket_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_status_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ticket_id uuid NOT NULL,
    from_status character varying(20),
    to_status character varying(20) NOT NULL,
    changed_by uuid NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ticket_status_history OWNER TO postgres;

--
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ticket_number character varying(32) NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    assigned_to uuid,
    category character varying(50) NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying,
    subject character varying(200) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone,
    closed_at timestamp without time zone,
    CONSTRAINT tickets_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'waiting_on_customer'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- Name: user_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    user_email character varying(255) NOT NULL,
    event_type character varying(50) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(255),
    entity_name character varying(255),
    before jsonb,
    after jsonb,
    changes jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_audit_logs OWNER TO postgres;

--
-- Name: TABLE user_audit_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_audit_logs IS 'Audit trail for customer activities (login, orders, payments, profile changes)';


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    auth_user_id uuid NOT NULL,
    full_name character varying NOT NULL,
    phone character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    avatar_url text
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: user_profiles PK_1ec6662219f4605723f1e41b6cb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY (id);


--
-- Name: product_variants PK_281e3f2c55652d6a22c0aa59fd7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY (id);


--
-- Name: email_otp_codes PK_2b62eb55be3a64f65ed1b0c41cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_otp_codes
    ADD CONSTRAINT "PK_2b62eb55be3a64f65ed1b0c41cc" PRIMARY KEY (id);


--
-- Name: oauth_accounts PK_710a81523f515b78f894e33bb10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_accounts
    ADD CONSTRAINT "PK_710a81523f515b78f894e33bb10" PRIMARY KEY (id);


--
-- Name: refresh_tokens PK_7d8bee0204106019488c4c50ffa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: auth_users PK_c88cc8077366b470dafc2917366; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY (id);


--
-- Name: cart_items PK_cart_items; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_cart_items" PRIMARY KEY (id);


--
-- Name: carts PK_carts; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_carts" PRIMARY KEY (id);


--
-- Name: shipping_addresses PK_shipping_addresses; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "PK_shipping_addresses" PRIMARY KEY (id);


--
-- Name: user_profiles UQ_0182bd232f7cd50face0b8340de; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "UQ_0182bd232f7cd50face0b8340de" UNIQUE (auth_user_id);


--
-- Name: auth_users UQ_13d8b49e55a8b06bee6bbc828fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT "UQ_13d8b49e55a8b06bee6bbc828fb" UNIQUE (email);


--
-- Name: products UQ_464f927ae360106b783ed0b4106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE (slug);


--
-- Name: product_variants UQ_46f236f21640f9da218a063a866; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "UQ_46f236f21640f9da218a063a866" UNIQUE (sku);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: collections collections_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_name_key UNIQUE (name);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: collections collections_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_slug_key UNIQUE (slug);


--
-- Name: discount_target_groups discount_target_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_target_groups
    ADD CONSTRAINT discount_target_groups_pkey PRIMARY KEY (id);


--
-- Name: discount_usages discount_usages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_pkey PRIMARY KEY (id);


--
-- Name: discounts discounts_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_code_key UNIQUE (code);


--
-- Name: discounts discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_pkey PRIMARY KEY (id);


--
-- Name: login_audit_logs login_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_audit_logs
    ADD CONSTRAINT login_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: order_addresses order_addresses_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses
    ADD CONSTRAINT order_addresses_order_id_key UNIQUE (order_id);


--
-- Name: order_addresses order_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses
    ADD CONSTRAINT order_addresses_pkey PRIMARY KEY (id);


--
-- Name: order_discounts order_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_discounts
    ADD CONSTRAINT order_discounts_pkey PRIMARY KEY (order_id, discount_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_collection_map product_collection_map_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection_map
    ADD CONSTRAINT product_collection_map_pkey PRIMARY KEY (id);


--
-- Name: product_collection_map product_collection_map_product_id_collection_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection_map
    ADD CONSTRAINT product_collection_map_product_id_collection_id_key UNIQUE (product_id, collection_id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: settings_history settings_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings_history
    ADD CONSTRAINT settings_history_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: settings_version settings_version_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings_version
    ADD CONSTRAINT settings_version_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: ticket_messages ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: ticket_status_history ticket_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status_history
    ADD CONSTRAINT ticket_status_history_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: settings unique_key_env; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT unique_key_env UNIQUE (key, environment);


--
-- Name: user_audit_logs user_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_audit_logs
    ADD CONSTRAINT user_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: IDX_23ebf9ba44bb12b9c31621d10d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_23ebf9ba44bb12b9c31621d10d" ON public.email_otp_codes USING btree (email, expires_at);


--
-- Name: IDX_513c4c020e55f5d3d4333279df; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_513c4c020e55f5d3d4333279df" ON public.email_otp_codes USING btree (email, created_at);


--
-- Name: IDX_901a374710fdcec83707b3684a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_901a374710fdcec83707b3684a" ON public.email_otp_codes USING btree (email, used_at);


--
-- Name: IDX_CARTS_USER_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_CARTS_USER_ID" ON public.carts USING btree (user_id);


--
-- Name: IDX_CART_ITEMS_CART_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_CART_ITEMS_CART_ID" ON public.cart_items USING btree (cart_id);


--
-- Name: IDX_CART_ITEMS_PRODUCT_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_CART_ITEMS_PRODUCT_ID" ON public.cart_items USING btree (product_id);


--
-- Name: IDX_CART_ITEMS_VARIANT_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_CART_ITEMS_VARIANT_ID" ON public.cart_items USING btree (variant_id);


--
-- Name: IDX_PRODUCTS_SLUG; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_PRODUCTS_SLUG" ON public.products USING btree (slug);


--
-- Name: IDX_PRODUCT_VARIANTS_PRODUCT_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_PRODUCT_VARIANTS_PRODUCT_ID" ON public.product_variants USING btree (product_id);


--
-- Name: IDX_PRODUCT_VARIANTS_SKU; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_PRODUCT_VARIANTS_SKU" ON public.product_variants USING btree (sku);


--
-- Name: IDX_ea7720e04e3ae1278575c3159c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_ea7720e04e3ae1278575c3159c" ON public.oauth_accounts USING btree (provider, provider_user_id);


--
-- Name: idx_collections_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collections_active ON public.collections USING btree (is_active, scheduled_start, scheduled_end);


--
-- Name: idx_collections_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collections_name ON public.collections USING btree (name);


--
-- Name: idx_collections_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collections_slug ON public.collections USING btree (slug);


--
-- Name: idx_discounts_active_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_discounts_active_lookup ON public.discounts USING btree (is_active) WHERE (deleted_at IS NULL);


--
-- Name: idx_history_changed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_changed_at ON public.settings_history USING btree (changed_at DESC);


--
-- Name: idx_history_key_env; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_key_env ON public.settings_history USING btree (key, environment);


--
-- Name: idx_history_setting; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_history_setting ON public.settings_history USING btree (setting_id);


--
-- Name: idx_login_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_audit_logs_created_at ON public.login_audit_logs USING btree (created_at DESC);


--
-- Name: idx_login_audit_logs_event_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_audit_logs_event_type ON public.login_audit_logs USING btree (event_type);


--
-- Name: idx_login_audit_logs_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_audit_logs_user_email ON public.login_audit_logs USING btree (user_email);


--
-- Name: idx_login_audit_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_audit_logs_user_id ON public.login_audit_logs USING btree (user_id);


--
-- Name: idx_login_audit_logs_user_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_login_audit_logs_user_type ON public.login_audit_logs USING btree (user_type);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_order_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_product ON public.order_items USING btree (product_id);


--
-- Name: idx_orders_order_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_order_number ON public.orders USING btree (order_number);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_created ON public.orders USING btree (user_id, created_at DESC);


--
-- Name: idx_payments_order_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_order_status ON public.payments USING btree (order_id, status);


--
-- Name: idx_payments_provider_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_provider_payment_id ON public.payments USING btree (provider_payment_id);


--
-- Name: idx_pcm_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pcm_collection_id ON public.product_collection_map USING btree (collection_id);


--
-- Name: idx_pcm_collection_position; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pcm_collection_position ON public.product_collection_map USING btree (collection_id, "position");


--
-- Name: idx_pcm_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pcm_product_id ON public.product_collection_map USING btree (product_id);


--
-- Name: idx_product_images_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_images_active ON public.product_images USING btree (product_id, status, is_primary, display_order);


--
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- Name: idx_settings_key_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_settings_key_active ON public.settings USING btree (key, environment, is_active, is_published);


--
-- Name: idx_settings_section_env; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_settings_section_env ON public.settings USING btree (section, environment);


--
-- Name: idx_settings_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_settings_version ON public.settings USING btree (version);


--
-- Name: idx_shipping_postal_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shipping_postal_code ON public.shipping_addresses USING btree (postal_code) WHERE (deleted_at IS NULL);


--
-- Name: idx_shipping_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shipping_user_id ON public.shipping_addresses USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_status_history_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_history_order ON public.order_status_history USING btree (order_id, created_at DESC);


--
-- Name: idx_ticket_messages_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ticket_messages_created ON public.ticket_messages USING btree (created_at);


--
-- Name: idx_ticket_messages_ticket; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages USING btree (ticket_id);


--
-- Name: idx_ticket_status_history_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ticket_status_history_created ON public.ticket_status_history USING btree (created_at DESC);


--
-- Name: idx_ticket_status_history_ticket; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ticket_status_history_ticket ON public.ticket_status_history USING btree (ticket_id);


--
-- Name: idx_tickets_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_assigned ON public.tickets USING btree (assigned_to) WHERE (assigned_to IS NOT NULL);


--
-- Name: idx_tickets_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_created ON public.tickets USING btree (created_at DESC);


--
-- Name: idx_tickets_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_order ON public.tickets USING btree (order_id);


--
-- Name: idx_tickets_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_status ON public.tickets USING btree (status);


--
-- Name: idx_tickets_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_user ON public.tickets USING btree (user_id);


--
-- Name: idx_unique_active_ticket_per_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_unique_active_ticket_per_order ON public.tickets USING btree (order_id) WHERE ((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'waiting_on_customer'::character varying])::text[]));


--
-- Name: idx_usage_discount_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_discount_user ON public.discount_usages USING btree (discount_id, user_id);


--
-- Name: idx_user_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_audit_logs_created_at ON public.user_audit_logs USING btree (created_at DESC);


--
-- Name: idx_user_audit_logs_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_audit_logs_entity ON public.user_audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_user_audit_logs_event_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_audit_logs_event_type ON public.user_audit_logs USING btree (event_type);


--
-- Name: idx_user_audit_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_audit_logs_user_id ON public.user_audit_logs USING btree (user_id);


--
-- Name: idx_variants_stock; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_variants_stock ON public.product_variants USING btree (product_id, is_active, stock_quantity);


--
-- Name: unique_default_address_per_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_default_address_per_user ON public.shipping_addresses USING btree (user_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: settings settings_version_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER settings_version_trigger AFTER INSERT OR DELETE OR UPDATE ON public.settings FOR EACH STATEMENT EXECUTE FUNCTION public.increment_settings_version();


--
-- Name: tickets trigger_set_ticket_closed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_ticket_closed BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.set_ticket_closed_at();


--
-- Name: tickets trigger_set_ticket_resolved; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_ticket_resolved BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.set_ticket_resolved_at();


--
-- Name: tickets trigger_update_ticket_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_ticket_timestamp BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_ticket_updated_at();


--
-- Name: user_profiles FK_0182bd232f7cd50face0b8340de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "FK_0182bd232f7cd50face0b8340de" FOREIGN KEY (auth_user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: oauth_accounts FK_22a05e92f51a983475f9281d3b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_accounts
    ADD CONSTRAINT "FK_22a05e92f51a983475f9281d3b0" FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens FK_3ddc983c5f7bcf132fd8732c3f4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: product_variants FK_6343513e20e2deab45edfce1316; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart_items FK_cart_items_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_cart_items_cart" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items FK_cart_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_cart_items_product" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: cart_items FK_cart_items_variant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_cart_items_variant" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL;


--
-- Name: carts FK_carts_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_carts_user" FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: admin_audit_logs admin_audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.auth_users(id) ON DELETE SET NULL;


--
-- Name: discount_target_groups discount_target_groups_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_target_groups
    ADD CONSTRAINT discount_target_groups_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE CASCADE;


--
-- Name: discount_target_groups discount_target_groups_group_value_uuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_target_groups
    ADD CONSTRAINT discount_target_groups_group_value_uuid_fkey FOREIGN KEY (group_value_uuid) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: discount_usages discount_usages_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE CASCADE;


--
-- Name: discount_usages discount_usages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_usages
    ADD CONSTRAINT discount_usages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE SET NULL;


--
-- Name: order_addresses fk_order_addresses_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_addresses
    ADD CONSTRAINT fk_order_addresses_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_items_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_status_history fk_order_status_history_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT fk_order_status_history_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: payments fk_payments_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: settings_history fk_setting; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings_history
    ADD CONSTRAINT fk_setting FOREIGN KEY (setting_id) REFERENCES public.settings(id) ON DELETE CASCADE;


--
-- Name: shipments fk_shipments_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: shipping_addresses fk_user_shipping_address; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT fk_user_shipping_address FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: login_audit_logs login_audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_audit_logs
    ADD CONSTRAINT login_audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: order_discounts order_discounts_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_discounts
    ADD CONSTRAINT order_discounts_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE SET NULL;


--
-- Name: order_discounts order_discounts_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_discounts
    ADD CONSTRAINT order_discounts_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: product_collection_map product_collection_map_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection_map
    ADD CONSTRAINT product_collection_map_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: product_collection_map product_collection_map_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection_map
    ADD CONSTRAINT product_collection_map_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: ticket_messages ticket_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: ticket_messages ticket_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE RESTRICT;


--
-- Name: ticket_status_history ticket_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status_history
    ADD CONSTRAINT ticket_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.auth_users(id) ON DELETE RESTRICT;


--
-- Name: ticket_status_history ticket_status_history_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status_history
    ADD CONSTRAINT ticket_status_history_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.auth_users(id) ON DELETE SET NULL;


--
-- Name: tickets tickets_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE RESTRICT;


--
-- Name: tickets tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE RESTRICT;


--
-- Name: user_audit_logs user_audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_audit_logs
    ADD CONSTRAINT user_audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict wJ5UPCKcwV1350mT6Dho6gsE0NobwqMDYdstQdtui8gapTZft9R2x1dIGk04apw

