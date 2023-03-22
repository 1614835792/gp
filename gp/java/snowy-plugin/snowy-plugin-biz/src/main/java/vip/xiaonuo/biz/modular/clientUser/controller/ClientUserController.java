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
package vip.xiaonuo.biz.modular.clientUser.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSupport;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vip.xiaonuo.common.annotation.CommonLog;
import vip.xiaonuo.common.pojo.CommonResult;
import vip.xiaonuo.common.pojo.CommonValidList;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserAddParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserEditParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserIdParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserPageParam;
import vip.xiaonuo.biz.modular.clientUser.service.ClientUserService;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

/**
 * C端用户控制器
 *
 * @author gzj
 * @date  2023/03/20 11:17
 */
@Api(tags = "C端用户控制器")
@ApiSupport(author = "SNOWY_TEAM", order = 1)
@RestController
@Validated
public class ClientUserController {

    @Resource
    private ClientUserService clientUserService;

    /**
     * 获取C端用户分页
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    @ApiOperationSupport(order = 1)
    @ApiOperation("获取C端用户分页")
    @SaCheckPermission("/biz/clientUser/page")
    @GetMapping("/biz/clientUser/page")
    public CommonResult<Page<ClientUser>> page(ClientUserPageParam clientUserPageParam) {
        return CommonResult.data(clientUserService.page(clientUserPageParam));
    }

    /**
     * 添加C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    @ApiOperationSupport(order = 2)
    @ApiOperation("添加C端用户")
    @CommonLog("添加C端用户")
    @SaCheckPermission("/biz/clientUser/add")
    @PostMapping("/biz/clientUser/add")
    public CommonResult<String> add(@RequestBody @Valid ClientUserAddParam clientUserAddParam) {
        clientUserService.add(clientUserAddParam);
        return CommonResult.ok();
    }

    /**
     * 编辑C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    @ApiOperationSupport(order = 3)
    @ApiOperation("编辑C端用户")
    @CommonLog("编辑C端用户")
    @SaCheckPermission("/biz/clientUser/edit")
    @PostMapping("/biz/clientUser/edit")
    public CommonResult<String> edit(@RequestBody @Valid ClientUserEditParam clientUserEditParam) {
        clientUserService.edit(clientUserEditParam);
        return CommonResult.ok();
    }

    /**
     * 删除C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    @ApiOperationSupport(order = 4)
    @ApiOperation("删除C端用户")
    @CommonLog("删除C端用户")
    @SaCheckPermission("/biz/clientUser/delete")
    @PostMapping("/biz/clientUser/delete")
    public CommonResult<String> delete(@RequestBody @Valid @NotEmpty(message = "集合不能为空")
                                                   CommonValidList<ClientUserIdParam> clientUserIdParamList) {
        clientUserService.delete(clientUserIdParamList);
        return CommonResult.ok();
    }

    /**
     * 获取C端用户详情
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    @ApiOperationSupport(order = 5)
    @ApiOperation("获取C端用户详情")
    @SaCheckPermission("/biz/clientUser/detail")
    @GetMapping("/biz/clientUser/detail")
    public CommonResult<ClientUser> detail(@Valid ClientUserIdParam clientUserIdParam) {
        return CommonResult.data(clientUserService.detail(clientUserIdParam));
    }
}
