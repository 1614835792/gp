/*
 * Copyright [2022] [https://www.xiaonuo.vip]
 *
 * Snowy采用APACHE LICENSE 2.0开源协议，您在使用过程中，需要注意以下几点：
 *
 * 1.请不要删除和修改根目录下的LICENSE文件。
 * 2.请不要删除和修改Snowy源码头部的版权声明。
 * 3.本项目代码可免费商业使用，商业使用请保留源码和相关描述文件的项目出处，作者声明等。
 * 4.分发源码时候，请注明软件出处 https://www.xiaonuo.vip
 * 5.不可二次分发开源参与同类竞品，如有想法可联系团队xiaonuobase@qq.com商议合作。
 * 6.若您的项目无法满足以上几点，需要更多功能代码，获取Snowy商业授权许可，请在官网购买授权，地址为 https://www.xiaonuo.vip
 */
package vip.xiaonuo.biz.modular.clientUser.param;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

/**
 * C端用户添加参数
 *
 * @author gzj
 * @date  2023/03/20 11:17
 **/
@Getter
@Setter
public class ClientUserAddParam {

    /** 账号 */
    @ApiModelProperty(value = "账号", position = 2)
    private String account;

    /** 密码 */
    @ApiModelProperty(value = "密码", position = 3)
    private String password;

    /** 姓名 */
    @ApiModelProperty(value = "姓名", position = 4)
    private String name;

    /** 昵称 */
    @ApiModelProperty(value = "昵称", position = 5)
    private String nickname;

    /** 手机 */
    @ApiModelProperty(value = "手机", position = 6)
    private String phone;

    /** 用户状态 */
    @ApiModelProperty(value = "用户状态", position = 15)
    private String userStatus;

    /** 排序码 */
    @ApiModelProperty(value = "排序码", position = 16)
    private Integer sortCode;

    /** 扩展信息 */
    @ApiModelProperty(value = "扩展信息", position = 17)
    private String extJson;

}
