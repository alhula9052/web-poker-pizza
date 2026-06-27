import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import {
  deactivateAdminGalleryItem,
  deactivateAdminProduct,
  deactivateAdminPromotion,
  getAdminGalleryItems,
  getAdminProducts,
  getAdminPromotions,
  saveAdminGalleryItem,
  saveAdminProduct,
  saveAdminPromotion,
  uploadGalleryImage,
  uploadProductImage,
  uploadPromotionImage,
} from "../services/adminService";

const emptyProductForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  category: "Especiales",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

const emptyPromotionForm = {
  id: null,
  title: "",
  description: "",
  price: "",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

const emptyGalleryForm = {
  id: null,
  title: "",
  image_url: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setIsCheckingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError(
        "No se pudo iniciar sesión. Revisa el correo, la clave y que el usuario exista en Supabase Auth."
      );
    }

    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!supabase) {
    return (
      <AdminShell>
        <div className="admin-login-card">
          <span className="eyebrow">Configuración pendiente</span>
          <h1>Supabase no está configurado</h1>
          <p>
            Revisa el archivo <strong>.env</strong> y confirma que existan las variables
            VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.
          </p>
          <BackToSiteButton />
        </div>
      </AdminShell>
    );
  }

  if (isCheckingSession) {
    return (
      <AdminShell>
        <div className="admin-login-card">
          <span className="eyebrow">Administrador</span>
          <h1>Cargando acceso...</h1>
        </div>
      </AdminShell>
    );
  }

  if (!session) {
    return (
      <AdminShell>
        <form className="admin-login-card" onSubmit={handleLogin}>
          <img src="/logo-poker-pizza.png" alt="Póker Pizza" />
          <span className="eyebrow">Ingreso administrador</span>
          <h1>Panel Póker Pizza</h1>
          <p>
            Ingresa con el usuario creado en Supabase para editar productos,
            promociones, galería, precios, descripciones e imágenes.
          </p>

          <label>
            Correo administrador
            <input
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="admin@pokerpizza.cl"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {loginError && <div className="admin-error">{loginError}</div>}

          <button className="btn btn-gold full-width" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Ingresando..." : "Ingresar al panel"}
          </button>

          <BackToSiteButton />
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AdminDashboard session={session} onLogout={handleLogout} />
    </AdminShell>
  );
}

function AdminDashboard({ session, onLogout }) {
  const [activeSection, setActiveSection] = useState("products");
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [promotionForm, setPromotionForm] = useState(emptyPromotionForm);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [productImageFile, setProductImageFile] = useState(null);
  const [promotionImageFile, setPromotionImageFile] = useState(null);
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeProductCount = useMemo(
    () => products.filter((product) => product.is_active).length,
    [products]
  );

  const activePromotionCount = useMemo(
    () => promotions.filter((promotion) => promotion.is_active).length,
    [promotions]
  );

  const activeGalleryCount = useMemo(
    () => galleryItems.filter((item) => item.is_active).length,
    [galleryItems]
  );

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)),
    [products]
  );

  const sortedPromotions = useMemo(
    () => [...promotions].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)),
    [promotions]
  );

  const sortedGalleryItems = useMemo(
    () => [...galleryItems].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)),
    [galleryItems]
  );

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setError("");

    try {
      const { data, error: accessError } = await supabase.rpc("is_admin");
      if (accessError) throw accessError;

      setIsAuthorized(Boolean(data));
      if (data) await Promise.all([loadProducts(), loadPromotions(), loadGalleryItems()]);
    } catch (accessError) {
      setIsAuthorized(false);
      setIsLoadingProducts(false);
      setIsLoadingPromotions(false);
      setIsLoadingGallery(false);
      setError(
        "No se pudo validar el acceso administrador. Ejecuta sql/admin_setup.sql y autoriza tu usuario en public.admin_users."
      );
      console.error(accessError);
    }
  };

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    setError("");

    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (loadError) {
      setError(
        "No se pudieron cargar los productos. Revisa que la tabla products exista y que tu usuario esté autorizado como administrador."
      );
      console.error(loadError);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadPromotions = async () => {
    setIsLoadingPromotions(true);
    setError("");

    try {
      const data = await getAdminPromotions();
      setPromotions(data);
    } catch (loadError) {
      setError(
        "No se pudieron cargar las promociones. Ejecuta sql/admin_promotions_setup.sql si tu tabla promotions aún no tiene sort_order."
      );
      console.error(loadError);
    } finally {
      setIsLoadingPromotions(false);
    }
  };

  const loadGalleryItems = async () => {
    setIsLoadingGallery(true);
    setError("");

    try {
      const data = await getAdminGalleryItems();
      setGalleryItems(data);
    } catch (loadError) {
      setError(
        "No se pudo cargar la galería. Ejecuta sql/admin_gallery_setup.sql para crear gallery_items y sus permisos."
      );
      console.error(loadError);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const updateProductForm = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const updatePromotionForm = (field, value) => {
    setPromotionForm((current) => ({ ...current, [field]: value }));
  };

  const updateGalleryForm = (field, value) => {
    setGalleryForm((current) => ({ ...current, [field]: value }));
  };

  const startNewProduct = () => {
    setProductForm(emptyProductForm);
    setProductImageFile(null);
    setMessage("");
    setError("");
  };

  const startNewPromotion = () => {
    setPromotionForm(emptyPromotionForm);
    setPromotionImageFile(null);
    setMessage("");
    setError("");
  };

  const startNewGalleryItem = () => {
    setGalleryForm(emptyGalleryForm);
    setGalleryImageFile(null);
    setMessage("");
    setError("");
  };

  const editProduct = (product) => {
    setActiveSection("products");
    setProductForm({
      id: product.id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Especiales",
      image_url: product.image_url || "",
      is_active: Boolean(product.is_active),
      sort_order: product.sort_order || 0,
    });
    setProductImageFile(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editPromotion = (promotion) => {
    setActiveSection("promotions");
    setPromotionForm({
      id: promotion.id,
      title: promotion.title || "",
      description: promotion.description || "",
      price: promotion.price || "",
      image_url: promotion.image_url || "",
      is_active: Boolean(promotion.is_active),
      sort_order: promotion.sort_order || 0,
    });
    setPromotionImageFile(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editGalleryItem = (item) => {
    setActiveSection("gallery");
    setGalleryForm({
      id: item.id,
      title: item.title || "",
      image_url: item.image_url || "",
      is_active: Boolean(item.is_active),
      sort_order: item.sort_order || 0,
    });
    setGalleryImageFile(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!productForm.name.trim()) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    if (!Number(productForm.price) || Number(productForm.price) < 0) {
      setError("Ingresa un precio válido.");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = productForm.image_url;

      if (productImageFile) {
        imageUrl = await uploadProductImage(productImageFile, productForm.name);
      }

      const savedProduct = await saveAdminProduct({ ...productForm, image_url: imageUrl });

      setProducts((current) => {
        const exists = current.some((product) => product.id === savedProduct.id);
        if (exists) {
          return current.map((product) =>
            product.id === savedProduct.id ? savedProduct : product
          );
        }
        return [savedProduct, ...current];
      });

      setProductForm({
        id: savedProduct.id,
        name: savedProduct.name || "",
        description: savedProduct.description || "",
        price: savedProduct.price || "",
        category: savedProduct.category || "Especiales",
        image_url: savedProduct.image_url || "",
        is_active: Boolean(savedProduct.is_active),
        sort_order: savedProduct.sort_order || 0,
      });
      setProductImageFile(null);
      setMessage("Producto guardado correctamente.");
    } catch (saveError) {
      setError(
        "No se pudo guardar el producto. Revisa políticas RLS, bucket product-images y autorización del usuario administrador."
      );
      console.error(saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromotionSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!promotionForm.title.trim()) {
      setError("Ingresa el nombre de la promoción.");
      return;
    }

    if (promotionForm.price !== "" && Number(promotionForm.price) < 0) {
      setError("Ingresa un precio válido para la promoción.");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = promotionForm.image_url;

      if (promotionImageFile) {
        imageUrl = await uploadPromotionImage(promotionImageFile, promotionForm.title);
      }

      const savedPromotion = await saveAdminPromotion({ ...promotionForm, image_url: imageUrl });

      setPromotions((current) => {
        const exists = current.some((promotion) => promotion.id === savedPromotion.id);
        if (exists) {
          return current.map((promotion) =>
            promotion.id === savedPromotion.id ? savedPromotion : promotion
          );
        }
        return [savedPromotion, ...current];
      });

      setPromotionForm({
        id: savedPromotion.id,
        title: savedPromotion.title || "",
        description: savedPromotion.description || "",
        price: savedPromotion.price || "",
        image_url: savedPromotion.image_url || "",
        is_active: Boolean(savedPromotion.is_active),
        sort_order: savedPromotion.sort_order || 0,
      });
      setPromotionImageFile(null);
      setMessage("Promoción guardada correctamente.");
    } catch (saveError) {
      setError(
        "No se pudo guardar la promoción. Ejecuta sql/admin_promotions_setup.sql y revisa políticas RLS."
      );
      console.error(saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGallerySubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!galleryForm.title.trim()) {
      setError("Ingresa el título de la imagen de galería.");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = galleryForm.image_url;

      if (galleryImageFile) {
        imageUrl = await uploadGalleryImage(galleryImageFile, galleryForm.title);
      }

      const savedItem = await saveAdminGalleryItem({ ...galleryForm, image_url: imageUrl });

      setGalleryItems((current) => {
        const exists = current.some((item) => item.id === savedItem.id);
        if (exists) {
          return current.map((item) => (item.id === savedItem.id ? savedItem : item));
        }
        return [savedItem, ...current];
      });

      setGalleryForm({
        id: savedItem.id,
        title: savedItem.title || "",
        image_url: savedItem.image_url || "",
        is_active: Boolean(savedItem.is_active),
        sort_order: savedItem.sort_order || 0,
      });
      setGalleryImageFile(null);
      setMessage("Imagen de galería guardada correctamente.");
    } catch (saveError) {
      setError(
        "No se pudo guardar la imagen de galería. Ejecuta sql/admin_gallery_setup.sql y revisa políticas RLS."
      );
      console.error(saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateProduct = async (product) => {
    const shouldDeactivate = window.confirm(
      `¿Desactivar ${product.name}? No aparecerá en la carta pública.`
    );
    if (!shouldDeactivate) return;

    setError("");
    setMessage("");

    try {
      await deactivateAdminProduct(product.id);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, is_active: false } : item
        )
      );
      if (productForm.id === product.id) updateProductForm("is_active", false);
      setMessage("Producto desactivado correctamente.");
    } catch (deactivateError) {
      setError("No se pudo desactivar el producto.");
      console.error(deactivateError);
    }
  };

  const handleDeactivatePromotion = async (promotion) => {
    const shouldDeactivate = window.confirm(
      `¿Desactivar ${promotion.title}? No aparecerá en promociones públicas.`
    );
    if (!shouldDeactivate) return;

    setError("");
    setMessage("");

    try {
      await deactivateAdminPromotion(promotion.id);
      setPromotions((current) =>
        current.map((item) =>
          item.id === promotion.id ? { ...item, is_active: false } : item
        )
      );
      if (promotionForm.id === promotion.id) updatePromotionForm("is_active", false);
      setMessage("Promoción desactivada correctamente.");
    } catch (deactivateError) {
      setError("No se pudo desactivar la promoción.");
      console.error(deactivateError);
    }
  };

  const handleDeactivateGalleryItem = async (item) => {
    const shouldDeactivate = window.confirm(
      `¿Ocultar ${item.title}? No aparecerá en la galería pública.`
    );
    if (!shouldDeactivate) return;

    setError("");
    setMessage("");

    try {
      await deactivateAdminGalleryItem(item.id);
      setGalleryItems((current) =>
        current.map((galleryItem) =>
          galleryItem.id === item.id ? { ...galleryItem, is_active: false } : galleryItem
        )
      );
      if (galleryForm.id === item.id) updateGalleryForm("is_active", false);
      setMessage("Imagen de galería ocultada correctamente.");
    } catch (deactivateError) {
      setError("No se pudo ocultar la imagen de galería.");
      console.error(deactivateError);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="admin-login-card">
        <span className="eyebrow">Administrador</span>
        <h1>Validando permisos...</h1>
        <p>Estamos confirmando que tu usuario esté autorizado para modificar carta, promociones y galería.</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-login-card">
        <span className="eyebrow">Acceso no autorizado</span>
        <h1>Falta autorizar este usuario</h1>
        <p>
          Tu sesión inició correctamente, pero este correo no está autorizado en la tabla
          <strong> public.admin_users</strong>. Ejecuta el bloque indicado en README.md.
        </p>
        {error && <div className="admin-error">{error}</div>}
        <button className="btn btn-dark full-width" type="button" onClick={onLogout}>
          <LogOut size={18} /> Cerrar sesión
        </button>
        <BackToSiteButton />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">Panel administrador</span>
          <h1>Póker Pizza</h1>
          <p>
            Administra carta digital, promociones, galería, imágenes, descripciones, precios y estado de publicación.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <BackToSiteButton />
          <button className="btn btn-dark" type="button" onClick={onLogout}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div>
          <strong>{products.length}</strong>
          <span>productos cargados</span>
        </div>
        <div>
          <strong>{activeProductCount}</strong>
          <span>productos visibles</span>
        </div>
        <div>
          <strong>{activePromotionCount}</strong>
          <span>promos visibles</span>
        </div>
        <div>
          <strong>{activeGalleryCount}</strong>
          <span>galería visible</span>
        </div>
        <div>
          <strong>{session.user.email}</strong>
          <span>usuario conectado</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeSection === "products" ? "active" : ""}
          type="button"
          onClick={() => setActiveSection("products")}
        >
          Productos
        </button>
        <button
          className={activeSection === "promotions" ? "active" : ""}
          type="button"
          onClick={() => setActiveSection("promotions")}
        >
          Promociones
        </button>
        <button
          className={activeSection === "gallery" ? "active" : ""}
          type="button"
          onClick={() => setActiveSection("gallery")}
        >
          Galería
        </button>
      </div>

      {(message || error) && (
        <div className={error ? "admin-error admin-alert" : "admin-success admin-alert"}>
          {error || message}
        </div>
      )}

      {activeSection === "products" && (
        <ProductsAdmin
          form={productForm}
          imageFile={productImageFile}
          isLoading={isLoadingProducts}
          isSaving={isSaving}
          products={sortedProducts}
          onChange={updateProductForm}
          onFileChange={setProductImageFile}
          onNew={startNewProduct}
          onRefresh={loadProducts}
          onSubmit={handleProductSubmit}
          onEdit={editProduct}
          onDeactivate={handleDeactivateProduct}
        />
      )}

      {activeSection === "promotions" && (
        <PromotionsAdmin
          form={promotionForm}
          imageFile={promotionImageFile}
          isLoading={isLoadingPromotions}
          isSaving={isSaving}
          promotions={sortedPromotions}
          onChange={updatePromotionForm}
          onFileChange={setPromotionImageFile}
          onNew={startNewPromotion}
          onRefresh={loadPromotions}
          onSubmit={handlePromotionSubmit}
          onEdit={editPromotion}
          onDeactivate={handleDeactivatePromotion}
        />
      )}

      {activeSection === "gallery" && (
        <GalleryAdmin
          form={galleryForm}
          imageFile={galleryImageFile}
          isLoading={isLoadingGallery}
          isSaving={isSaving}
          galleryItems={sortedGalleryItems}
          onChange={updateGalleryForm}
          onFileChange={setGalleryImageFile}
          onNew={startNewGalleryItem}
          onRefresh={loadGalleryItems}
          onSubmit={handleGallerySubmit}
          onEdit={editGalleryItem}
          onDeactivate={handleDeactivateGalleryItem}
        />
      )}
    </div>
  );
}

function ProductsAdmin({
  form,
  imageFile,
  isLoading,
  isSaving,
  products,
  onChange,
  onFileChange,
  onNew,
  onRefresh,
  onSubmit,
  onEdit,
  onDeactivate,
}) {
  return (
    <div className="admin-grid">
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Editor</span>
            <h2>{form.id ? "Editar producto" : "Nuevo producto"}</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onNew}>
            <Plus size={18} /> Nuevo
          </button>
        </div>

        <div className="admin-form-grid">
          <label>
            Nombre
            <input
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="Royal Pepperoni"
              required
            />
          </label>

          <label>
            Precio CLP
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(event) => onChange("price", event.target.value)}
              placeholder="10990"
              required
            />
          </label>

          <label>
            Categoría
            <input
              value={form.category}
              onChange={(event) => onChange("category", event.target.value)}
              placeholder="Especiales"
              list="product-categories"
            />
            <datalist id="product-categories">
              <option value="Clásicas" />
              <option value="Napolitanas" />
              <option value="Especiales" />
              <option value="Vegetarianas" />
              <option value="Promociones" />
            </datalist>
          </label>

          <label>
            Orden
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) => onChange("sort_order", event.target.value)}
              placeholder="1"
            />
          </label>
        </div>

        <label>
          Descripción
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Salsa artesanal, mozzarella, ingredientes frescos y terminación de la casa."
          />
        </label>

        <ImageEditor
          type="producto"
          imageFile={imageFile}
          imageUrl={form.image_url}
          title={form.name}
          fallbackAlt="Producto"
          fallbackPlaceholder="https://... o /gallery/poker-especial.svg"
          onFileChange={onFileChange}
          onImageUrlChange={(value) => onChange("image_url", value)}
        />

        <label className="admin-check-row">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => onChange("is_active", event.target.checked)}
          />
          Visible en carta pública
        </label>

        <button className="btn btn-gold full-width" type="submit" disabled={isSaving}>
          {isSaving ? (
            "Guardando..."
          ) : (
            <>
              <Save size={18} /> Guardar producto
            </>
          )}
        </button>
      </form>

      <section className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Carta</span>
            <h2>Productos existentes</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onRefresh}>
            <RefreshCw size={18} /> Actualizar
          </button>
        </div>

        {isLoading ? (
          <p className="admin-muted">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="admin-muted">Aún no hay productos cargados.</p>
        ) : (
          <div className="admin-product-list">
            {products.map((product) => (
              <AdminListItem
                key={product.id}
                imageUrl={product.image_url || "/gallery/poker-especial.svg"}
                title={product.name}
                description={product.description}
                price={product.price}
                badge={product.category}
                isActive={product.is_active}
                onEdit={() => onEdit(product)}
                onDeactivate={() => onDeactivate(product)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PromotionsAdmin({
  form,
  imageFile,
  isLoading,
  isSaving,
  promotions,
  onChange,
  onFileChange,
  onNew,
  onRefresh,
  onSubmit,
  onEdit,
  onDeactivate,
}) {
  return (
    <div className="admin-grid">
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Editor</span>
            <h2>{form.id ? "Editar promoción" : "Nueva promoción"}</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onNew}>
            <Plus size={18} /> Nueva
          </button>
        </div>

        <div className="admin-form-grid">
          <label>
            Nombre promoción
            <input
              value={form.title}
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Combo Escalera Real"
              required
            />
          </label>

          <label>
            Precio CLP
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(event) => onChange("price", event.target.value)}
              placeholder="14990"
            />
          </label>

          <label>
            Orden
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) => onChange("sort_order", event.target.value)}
              placeholder="1"
            />
          </label>
        </div>

        <label>
          Descripción
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Pizza especial + bebida + salsa de la casa."
          />
        </label>

        <ImageEditor
          type="promoción"
          imageFile={imageFile}
          imageUrl={form.image_url}
          title={form.title}
          fallbackAlt="Promoción"
          fallbackPlaceholder="https://... o /gallery/promo.svg"
          onFileChange={onFileChange}
          onImageUrlChange={(value) => onChange("image_url", value)}
        />

        <label className="admin-check-row">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => onChange("is_active", event.target.checked)}
          />
          Visible en promociones públicas
        </label>

        <button className="btn btn-gold full-width" type="submit" disabled={isSaving}>
          {isSaving ? (
            "Guardando..."
          ) : (
            <>
              <Save size={18} /> Guardar promoción
            </>
          )}
        </button>
      </form>

      <section className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Promociones</span>
            <h2>Promociones existentes</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onRefresh}>
            <RefreshCw size={18} /> Actualizar
          </button>
        </div>

        {isLoading ? (
          <p className="admin-muted">Cargando promociones...</p>
        ) : promotions.length === 0 ? (
          <p className="admin-muted">Aún no hay promociones cargadas.</p>
        ) : (
          <div className="admin-product-list">
            {promotions.map((promotion) => (
              <AdminListItem
                key={promotion.id}
                imageUrl={promotion.image_url || "/gallery/promo.svg"}
                title={promotion.title}
                description={promotion.description}
                price={promotion.price}
                badge="Promo"
                isActive={promotion.is_active}
                onEdit={() => onEdit(promotion)}
                onDeactivate={() => onDeactivate(promotion)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function GalleryAdmin({
  form,
  imageFile,
  isLoading,
  isSaving,
  galleryItems,
  onChange,
  onFileChange,
  onNew,
  onRefresh,
  onSubmit,
  onEdit,
  onDeactivate,
}) {
  return (
    <div className="admin-grid">
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Editor</span>
            <h2>{form.id ? "Editar imagen" : "Nueva imagen"}</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onNew}>
            <Plus size={18} /> Nueva
          </button>
        </div>

        <div className="admin-form-grid">
          <label>
            Título visible
            <input
              value={form.title}
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Pizza artesanal"
              required
            />
          </label>

          <label>
            Orden
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) => onChange("sort_order", event.target.value)}
              placeholder="1"
            />
          </label>
        </div>

        <ImageEditor
          type="imagen de galería"
          imageFile={imageFile}
          imageUrl={form.image_url}
          title={form.title}
          fallbackAlt="Imagen de galería"
          fallbackPlaceholder="https://... o /gallery/ambiente.svg"
          onFileChange={onFileChange}
          onImageUrlChange={(value) => onChange("image_url", value)}
        />

        <label className="admin-check-row">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => onChange("is_active", event.target.checked)}
          />
          Visible en galería pública
        </label>

        <button className="btn btn-gold full-width" type="submit" disabled={isSaving}>
          {isSaving ? (
            "Guardando..."
          ) : (
            <>
              <Save size={18} /> Guardar imagen
            </>
          )}
        </button>
      </form>

      <section className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <span className="eyebrow">Galería</span>
            <h2>Imágenes existentes</h2>
          </div>
          <button className="btn btn-dark" type="button" onClick={onRefresh}>
            <RefreshCw size={18} /> Actualizar
          </button>
        </div>

        {isLoading ? (
          <p className="admin-muted">Cargando galería...</p>
        ) : galleryItems.length === 0 ? (
          <p className="admin-muted">Aún no hay imágenes de galería cargadas.</p>
        ) : (
          <div className="admin-product-list">
            {galleryItems.map((item) => (
              <AdminListItem
                key={item.id}
                imageUrl={item.image_url || "/gallery/ambiente.svg"}
                title={item.title}
                description="Imagen visible en la sección Ambiente artesanal y premium."
                price={null}
                badge="Galería"
                isActive={item.is_active}
                onEdit={() => onEdit(item)}
                onDeactivate={() => onDeactivate(item)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ImageEditor({
  type,
  imageFile,
  imageUrl,
  title,
  fallbackAlt,
  fallbackPlaceholder,
  onFileChange,
  onImageUrlChange,
}) {
  return (
    <div className="admin-image-row">
      <div className="admin-image-preview">
        {imageUrl || imageFile ? (
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
            alt={title || fallbackAlt}
          />
        ) : (
          <span>Vista previa</span>
        )}
      </div>

      <div className="admin-image-fields">
        <label>
          Subir imagen de la {type}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </label>

        <label>
          URL de imagen
          <input
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
            placeholder={fallbackPlaceholder}
          />
        </label>
      </div>
    </div>
  );
}

function AdminListItem({
  imageUrl,
  title,
  description,
  price,
  badge,
  isActive,
  onEdit,
  onDeactivate,
}) {
  return (
    <article className="admin-product-item">
      <img src={imageUrl} alt={title} />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="admin-product-meta">
          {price !== null && price !== undefined && price !== "" && <strong>{formatPrice(price)}</strong>}
          <span>{badge}</span>
          <span className={isActive ? "status-active" : "status-inactive"}>
            {isActive ? (
              <><Eye size={14} /> Visible</>
            ) : (
              <><EyeOff size={14} /> Oculto</>
            )}
          </span>
        </div>
      </div>
      <div className="admin-product-actions">
        <button type="button" className="icon-action" onClick={onEdit} aria-label={`Editar ${title}`}>
          <Pencil size={18} />
        </button>
        <button type="button" className="icon-action danger" onClick={onDeactivate} aria-label={`Desactivar ${title}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

function AdminShell({ children }) {
  return (
    <main className="admin-shell">
      <div className="admin-bg-glow" />
      {children}
    </main>
  );
}

function BackToSiteButton() {
  return (
    <a className="btn btn-dark" href="#inicio">
      <ArrowLeft size={18} /> Ver sitio
    </a>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
