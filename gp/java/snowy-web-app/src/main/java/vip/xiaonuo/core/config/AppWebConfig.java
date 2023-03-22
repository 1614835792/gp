package vip.xiaonuo.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import vip.xiaonuo.client.core.intercept.ClientInterception;

import javax.annotation.Resource;

@Configuration
public class AppWebConfig implements WebMvcConfigurer {
    @Resource
    private ClientInterception clientInterception;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(clientInterception)
                .addPathPatterns("/app/**")
                .excludePathPatterns("/app/auth/c/doLogin")
                .excludePathPatterns("/app/dev/config/sysBaseList")
                .excludePathPatterns("/app/auth/b/getPicCaptcha")
                ;
    }
}
