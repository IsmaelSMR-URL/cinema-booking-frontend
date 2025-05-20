const API_BASE_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  
  const responseData = await response.json(); 
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Credenciales incorrectas');
  }
  
  // Guardar datos en localStorage
  localStorage.setItem('token', responseData.token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userData', JSON.stringify(responseData.user));
  
  // Disparar evento de login
  const loginEvent = new Event('login');
  window.dispatchEvent(loginEvent);
  
  // También disparar evento de storage para compatibilidad
  window.dispatchEvent(new Event('storage'));
  
  return responseData.user;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Intentar obtener el usuario de localStorage primero
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        console.log("Usuario obtenido de localStorage:", userData);
        return userData;
      } catch (e) {
        console.error("Error al parsear datos de localStorage:", e);
        localStorage.removeItem('userData');
      }
    }

    // Si no hay datos en localStorage, intentar obtener del servidor
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.log("Error en la respuesta del servidor:", response.status);
      // Si el token no es válido, limpiar el almacenamiento
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedIn');
      return null;
    }

    // Verificar que la respuesta es JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("La respuesta del servidor no es JSON:", contentType);
      throw new Error("Respuesta del servidor inválida");
    }
    
    const userData = await response.json();
    console.log("Datos del usuario obtenidos del servidor:", userData);
    
    // Actualizar localStorage con los nuevos datos
    localStorage.setItem('userData', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error al validar el token:', error);
    // En caso de error, limpiar el almacenamiento
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    return null;
  }
}

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    sessionStorage.removeItem('user'); // Eliminar el usuario del almacenamiento de sesión
    localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento local

    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cerrar sesión');
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
}

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el registro');
  }
  
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userData', JSON.stringify(user));
  
  // Disparar evento de login
  window.dispatchEvent(new Event('login'));
  
  return user;
};