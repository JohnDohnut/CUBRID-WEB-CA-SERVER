import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { UserRepositoryModule } from '@repository';

/**
 * CMS (Content Management System) module for handling CMS connections.
 * 
 * This module provides CMS connection functionality including host validation
 * and connection establishment. It integrates with the user repository
 * for accessing user host information.
 * 
 * @module CmsModule
 * @since 1.0.0
 */
@Module({
  imports: [UserRepositoryModule],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}

// Export services for documentation
export { CmsService } from './cms.service';