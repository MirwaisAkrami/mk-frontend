import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class EjabberdRoomsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getAllRooms(): Promise<string[]> {
    const res = await firstValueFrom(this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms`));
    return res.data || [];
  }

  async getOnlineRooms(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/online`)
    );
    return res.data || [];
  }

  async getRoomInfo(roomName: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}`)
    );
    return res.data;
  }

  async getRoomOccupants(roomName: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(
        `${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/occupants`
      )
    );
    return res.data || [];
  }

  async getRoomSubscribers(roomName: string): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(
        `${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/subscribers`
      )
    );
    return res.data || [];
  }

  async getRoomAffiliations(roomName: string, affiliation: string): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(
        `${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/affiliations/${encodeURIComponent(affiliation)}`
      )
    );
    return res.data || [];
  }

  async createRoom(request: any): Promise<void> {
    await firstValueFrom(this.http.post<Result>(`${this.apiUrl}/ejabberd/rooms`, request));
  }

  async setRoomAffiliation(roomName: string, userJid: string, affiliation: string): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(
        `${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/affiliations`,
        { userJid, affiliation }
      )
    );
  }

  async banFromRoom(roomName: string, userJid: string): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/ban`, {
        userJid,
      })
    );
  }

  async kickFromRoom(roomName: string, nick: string, reason?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/kick`, {
        nick,
        reason: reason || null,
      })
    );
  }

  async sendRoomMessage(roomName: string, body: string, nick?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/message`, {
        body,
        nick: nick || null,
      })
    );
  }

  async destroyRoom(roomName: string, reason?: string | null): Promise<void> {
    const url = new URL(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}`);
    if (reason) {
      url.searchParams.set('reason', reason);
    }
    await firstValueFrom(this.http.delete<Result>(url.toString()));
  }

  async getRoomOptions(roomName: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/options`)
    );
    return res.data || [];
  }

  async getRoomHistory(roomName: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/history`)
    );
    return res.data || [];
  }

  async getAllRoomAffiliations(roomName: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/affiliations`)
    );
    return res.data || [];
  }

  async getUserAffiliation(roomName: string, userJid: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.get<Result>(
        `${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/affiliation/${encodeURIComponent(userJid)}`
      )
    );
    return res.data as string;
  }

  async searchRooms(pattern: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/search`, {
        params: { pattern },
      })
    );
    return res.data || [];
  }

  async getRoomDetail(roomName: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/rooms/${encodeURIComponent(roomName)}/detail`)
    );
    return res.data;
  }
}
